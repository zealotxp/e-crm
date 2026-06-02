/**
 * ehaiba-crm 自动部署脚本
 * 功能: 版本号自增 → 构建 → 更新 CHANGELOG → 提交 → 推送 → Gitee Pages
 *
 * 用法:
 *   npm run deploy              # patch 版本自增 (1.0.7 → 1.0.8)
 *   npm run deploy:minor        # minor 版本自增 (1.0.7 → 1.1.0)
 *   npm run deploy:major        # major 版本自增 (1.0.7 → 2.0.0)
 *   或:
 *   node scripts/deploy.cjs [minor|major] [--message "说明"]
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

// ─── 工具 ────────────────────────────────────────────
const run = (cmd, opts = {}) => {
  console.log(`  > ${cmd}`)
  return execSync(cmd, { cwd: ROOT, stdio: 'inherit', ...opts })
}
const silent = (cmd) => execSync(cmd, { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' }).trim()
const bump = (ver, t) => {
  const [a, b, c] = ver.split('.').map(Number)
  return t === 'major' ? `${a + 1}.0.0` : t === 'minor' ? `${a}.${b + 1}.0` : `${a}.${b}.${c + 1}`
}
const today = () => new Date().toISOString().slice(0, 10)

// ─── 参数 ────────────────────────────────────────────
const args = process.argv.slice(2)
const bumpType = args.includes('major') ? 'major' : args.includes('minor') ? 'minor' : 'patch'
const mi = args.indexOf('--message')
const customMsg = mi > -1 ? args[mi + 1] : null

// ─── 主流程 ──────────────────────────────────────────
console.log('\n🚀 ehaiba-crm 自动部署\n' + '━'.repeat(50))

// 确保在 master 分支且工作区干净
const currentBranch = silent('git branch --show-current')
if (currentBranch !== 'master') {
  console.log('❌ 当前不在 master 分支，请先切换到 master')
  process.exit(1)
}

const dirty = silent('git status --porcelain')
if (dirty) {
  console.log('⚠ 工作区有未提交的变更，正在自动提交...')
  run('git add -A')
  try { run('git commit -m "chore: auto-commit before deploy"', { stdio: 'pipe' }) } catch {}
}

// 1. 版本升级
console.log('\n📦 Step 1: 版本号升级')
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'))
const oldVer = pkg.version
const newVer = bump(oldVer, bumpType)
pkg.version = newVer
fs.writeFileSync(path.join(ROOT, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')
console.log(`   ${oldVer} → ${newVer}`)

// 2. 构建
console.log('\n🔨 Step 2: 项目构建')
silent('npx vite build')

// 3. 验证
if (!fs.existsSync(path.join(ROOT, 'dist', 'index.html'))) {
  console.log('\n❌ 构建失败：dist/index.html 不存在')
  process.exit(1)
}

// 4. 更新 CHANGELOG
console.log('\n📝 Step 3: 更新 CHANGELOG')
const clPath = path.join(ROOT, 'CHANGELOG.md')
let cl = fs.readFileSync(clPath, 'utf-8')
const entry = `## [${newVer}] - ${today()}`
if (!cl.includes(entry)) {
  cl = cl.replace(/^(# CHANGELOG\n\n)/, `$1${entry}\n\n### Added\n- (请填写新功能)\n\n### Changed\n- (请填写变更)\n\n### Fixed\n- (请填写修复)\n\n---\n\n`)
  fs.writeFileSync(clPath, cl)
  console.log(`   已添加 v${newVer} 条目，请在 CHANGELOG.md 中补充具体内容`)
}

// 5. 提交 & 推送 master
console.log('\n📤 Step 4: 提交并推送 master')
run('git add -A')
const msg = customMsg || `chore: 发布 v${newVer}`
try { run(`git commit -m "${msg}"`, { stdio: 'pipe' }) } catch { console.log('   ⚠ 无新变更') }
run('git push origin master')

// 6. 部署 Pages
console.log('\n🌐 Step 5: 部署 Gitee Pages')
const pb = 'pages'

// 删除旧的 pages 分支
try { silent(`git branch -D ${pb}`) } catch {}

// 创建孤立分支
run(`git checkout --orphan ${pb}`)
silent('git rm -rf --cached .')
silent('git clean -fdx -e node_modules -e .git')

// 复制 dist 到根
fs.readdirSync(path.join(ROOT, 'dist')).forEach(f => {
  const src = path.join(ROOT, 'dist', f)
  const dst = path.join(ROOT, f)
  fs.cpSync(src, dst, { recursive: true })
})

run('git add -A')
run(`git commit -m "deploy: v${newVer} - Gitee Pages"`)
run(`git push origin ${pb} --force`)

// 切回 master
run('git checkout -f master')
silent(`git branch -D ${pb}`)

console.log('\n' + '━'.repeat(50))
console.log(`\n✅ v${newVer} 部署完成!`)
console.log(`   仓库: https://gitee.com/zealotxp/ehaiba-crm`)
console.log(`   Pages: https://zealotxp.gitee.io/ehaiba-crm\n`)
