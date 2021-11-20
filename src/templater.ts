import nunjucks from 'nunjucks'
import dateFilter from 'nunjucks-date-filter'
import fm from 'front-matter'

// templating code adapted from:
// https://github.com/JasonEtco/create-an-issue

export function templater(template: string, github: any): {title: string, body: string} {
  const env = nunjucks.configure({
    trimBlocks: true,
    lstripBlocks: true
  })
  env.addFilter('moment', dateFilter)

  const templateVariables = {
    github,
    env: process.env,
    timestamp: Date.now()
  }

  interface FrontMatterAttributes {
    title: string
    assignees?: string[] | string
    labels?: string[] | string
    milestone?: string | number
  }

  let { attributes, body } = fm<FrontMatterAttributes>(template)

  body = env.renderString(body, templateVariables)
  const title = env.renderString(attributes.title || '{{ timestamp | moment("L") }}', templateVariables)

  return { title, body }
}
