import * as github from '@actions/github'
import { getInput, setOutput, exportVariable } from '@actions/core'
import * as fs from 'fs'
import { execSync } from 'child_process'
import { templater } from './templater'

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
