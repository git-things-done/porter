import * as github from '@actions/github'
import { getInput, setOutput, exportVariable, warning, debug } from '@actions/core'
import * as fs from 'fs'
import { execSync } from 'child_process'
import { templater } from './templater'
import { shouldBeClosed } from './closer'

const slug = process.env.GITHUB_REPOSITORY!
const [owner, repo] = slug.split('/')
const token = getInput('token')!
const octokit = github.getOctokit(token)

const template = fs.readFileSync('templates/quotidian.md', 'utf8')
const { body, title } = templater(template, github.context)

const yesterday = execSync('git show origin/gh-pages:CURRENT').toString().trim()
const today = (await octokit.rest.issues.create({ repo, owner, title, body })).data.number

setOutput('yesterday', yesterday)
setOutput('today', today)

exportVariable('GTD_YESTERDAY', yesterday)
exportVariable('GTD_TODAY', today)

const yesterdayNumber = parseInt(yesterday)
const yesterdayBody = (await octokit.rest.issues.get({ repo, owner, issue_number: yesterdayNumber })).data.body
if (!yesterdayBody) {
  warning("yesterday’s body suspiciously empty")
} else if (shouldBeClosed(yesterdayBody)) {
  debug(`Closing #${yesterday}`)
  await octokit.rest.issues.update({ repo, owner, issue_number: yesterdayNumber, state: 'closed' })
}
