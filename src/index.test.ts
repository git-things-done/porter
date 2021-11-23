//TEST templater
import { templater } from './templater.js'

const { body, title } = templater(`
{% if (timestamp | moment("dayOfYear")) % 2 == 1 %}
odd
{% else %}
even
{% endif %}
`, { foo: 1 })

if (!title || !body) throw new Error("Unexpectedly empty template")

//TEST closer
import { shouldBeClosed } from './closer.js'
let rv: boolean

rv = shouldBeClosed(`
- [x] hi1
- [x] hi2
`)
if (!rv) throw new Error("here")

rv = shouldBeClosed(`
- [x] hi1
- [ ] hi2
`)
if (rv) throw new Error("here")

rv = shouldBeClosed(`
- [x] hi1
- [x] hi2
# Hi
- [ ] foo
`)
if (rv) throw new Error("here")

rv = shouldBeClosed(`
- [x] hi1
- [x] hi2
# Hi
- [x] foo
`)
if (!rv) throw new Error("here")
