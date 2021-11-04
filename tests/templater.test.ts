import { templater } from '../src/templater.js'

const { body, title } = templater(`
{% if (timestamp | moment("dayOfYear")) % 2 == 1 %}
odd
{% else %}
even
{% endif %}
`, { foo: 1 })

if (!title || !body) throw new Error("Unexpectedly empty template")
