/**
 * ehaiba-crm 自动部署脚本
 * 功能：版本号自增 → 构建 → 更新 CHANGELOG → 提交推送 → 部署 Gitee Pages
 *
 * 用法:
 *   node scripts/deploy.cjs              # patch 版本号自增 (1.0.7 → 1.0.8)
 *   node scripts/deploy.cjs minor        # minor 版本号自增 (1.0.7 → 1.1.0)
 *   node scripts/deploy.cjs major        # major 版本号自增 (1.0.7 → 2.0.0)
 *   node scripts/deploy.cjs --message "自定义提交说明"
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const PKG_PATH = path.join(ROOT, 'package.json')
const CHANGELOG_PATH = path.join(ROOT, 'CHANGELOG.md')
const DIST_DIR = path.join(ROOT, 'dist')

// ─── 工具函数 ───────────────────────────────────────
const run = (cmd, opts = {}) => {
  console.log(`  > ${cmd}`)
  return execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts })
}

const runSilent = (cmd) => {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' }).trim()
}

const bump = (version, type) => {
  const parts = version.split('.').map(Number)
  if (type === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0 }
  else if (type === 'minor') { parts[1]++; parts[2] = 0 }
  else { parts[2]++ }
  return parts.join('.')
}

const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ─── 参数解析 ───────────────────────────────────────
const args = process.argv.slice(2)
const bumpType = args.includes('major') ? 'major' : args.includes('minor') ? 'minor' : 'patch'
const msgIdx = args.indexOf('--message')
const customMessage = msgIdx > -1 ? args[msgIdx + 1] : null

// ─── 主流程 ─────────────────────────────────────────
console.log('\n🚀 ehaiba-crm 自动部署\n')
console.log('━'.repeat(50))

// 1. 读取并升级版本号
console.log('\n📦 Step 1: 版本号升级')
const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf-8'))
const oldVersion = pkg.version
const newVersion = bump(oldVersion, bumpType)
pkg.version = newVersion
fs.writeFileSync(PKG_PATH, JSON.stringify(pkg, null, 2) + '\n')
console.log(`   ${oldVersion} → ${newVersion}`)

// 2. 获取暂存区变更摘要生成默认 message
let commitMsg = customMessage
if (!commitMsg) {
  try {
    const staged = runSilent('git diff --cached --stat')
    const unstaged = runSilent('git diff --stat')
    const untracked = runSilent('git ls-files --others --exclude-standard')
    if (staged || unstaged || untracked) {
      const files = []
      if (staged) files.push(...staged.split('\n').filter(Boolean).slice(0, 3))
      if (unstaged) files.push(...unstaged.split('\n').filter(Boolean).slice(0, 3))
      commitMsg = `chore: 更新版本号至 v${newVersion}\n\n${files.join('\n')}`
    } else {
      commitMsg = `chore: 更新版本号至 v${newVersion}`
    }
  } catch {
    commitMsg = `chore: 更新版本号至 v${newVersion}`
  }
}

// 3. 构建
console.log('\n🔨 Step 2: 项目构建')
runSilent('npx vite build')

// 4. 确认 dist 存在
if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  console.log('\n❌ 构建失败：dist/index.html 不存在')
  process.exit(1)
}

// 5. 更新 CHANGELOG
console.log('\n📝 Step 3: 更新 CHANGELOG')
const changelogContent = fs.readFileSync(CHANGELOG_PATH, 'utf-8')
const title = `## [${newVersion}] - ${todayStr()}`
const hasEntry = changelogContent.includes(title)

if (!hasEntry) {
  const newEntry = `${title}

### Added
- (请在此处填写新功能)

### Changed
- (请在此处填写变更内容)

### Fixed
- (请在此处填写修复内容)

---

`
  const updated = changelogContent.replace(
    /^(# CHANGELOG\n\n)/,
    `$1${newEntry}`
  )
  fs.writeFileSync(CHANGELOG_PATH, updated)
  console.log(`   CHANGELOG 已添加 v${newVersion} 条目`)
} else {
  console.log(`   CHANGELOG 已存在 v${newVersion}，跳过`)
}

// 6. Git 提交 & 推送 master
console.log('\n📤 Step 4: 提交并推送 master 分支')
run('git add -A')
try {
  run(`git commit -m "${commitMsg.split('\n')[0]}"`, { stdio: 'pipe' })
} catch {
  console.log('   ⚠ 无变更需要提交')
}
run('git push origin master')

// 7. 部署 Gitee Pages
console.log('\n🌐 Step 5: 部署 Gitee Pages')
const pagesBranch = 'pages'

// 7a. 创建/更新 pages 分支
const hasPages = (() => {
  try { runSilent(`git rev-parse --verify ${pagesBranch}`); return true }
  catch { return false }
})()

if (hasPages) {
  // 切换到 pages 分支，清空后放入 dist 内容
  runSilent(`git branch -D ${pagesBranch}`)
}

// 创建孤立分支
runSilent(`git checkout --orphan ${pagesBranch}`)
runSilent('git rm -rf --cached . 2>nul || git rm -rf --cached .')
runSilent('git clean -fdx -e node_modules -e .git')

// 复制 dist 内容到根目录
const distFiles = fs.readdirSync(DIST_DIR)
distFiles.forEach(file => {
  const src = path.join(DIST_DIR, file)
  const dest = path.join(ROOT, file)
  if (fs.statSync(src).isDirectory()) {
    fs.cpSync(src, dest, { recursive: true })
  } else {
    fs.copyFileSync(src, dest)
  }
})

// 在 pages 分支根目录也放一个 .gitignore 防止无关文件
fs.writeFileSync(path.join(ROOT, '.gitignore'), 'node_modules/\n.gitee/\n')

run('git add -A')
try {
  run(`git commit -m "deploy: v${newVersion} - Gitee Pages"`, { stdio: 'pipe' })
} catch {
  console.log('   ⚠ pages 分支无变更')
}

// 强制推送 pages 分支
try {
  run(`git push origin ${pagesBranch} --force`)
} catch {
  console.log('   ⚠ pages 分支推送失败，请检查远程仓库是否支持')
}

// 7b. 切回 master
runSilent('git checkout master')
runSilent('git branch -D pages')

// 8. 完成
console.log('\n' + '━'.repeat(50))
console.log(`\n✅ 部署完成 v${newVersion}`)
console.log(`   📦 仓库: https://gitee.com/zealotxp/ehaiba-crm`)
console.log(`   🌐 Pages: https://zealotxp.gitee.io/ehaiba-crm`)
console.log(`   ⚠  Gitee Pages 需要手动在仓库设置中开启服务\n`)
