# “The Porter” for Git Things Done

The porter *opens* and *closes* your [GitTD] tickets every day
and thus is the first and primary action in your GitTD system.

To do this you will need a `porter.yml` workflow:

```yaml
on:
  …  # see @git-things-done/gtd docs
jobs:
  git-things-done:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # FIXME currently needed to obtain origin/gh-pages:CURRENT

      - uses: git-things-done/porter@v1
```

We require a file that represents the daily template at
[`templates/quotidian.md`][quotidian].

We uses [nunjucks][] to process your template and inject it with the worflow
environment, date and [GitHub Actions context][context].

## Automatically Closing Yesterday’s Ticket

Tickets are only closed if all the task items in the issue body are checked.

If you check everything before the porter runes, you will have to close
yesterday’s ticket manually.

We’re open to creating a separate action (or cleverly written mode for this
action) that closes old tickets if everything is checked.

## Indicating Items Were Not Completed

Check *and* strike-out items like so:

```markdown
- [x] ~thing to do~
```

## Advanced Example

```yaml
jobs:
  porter:
    runs-on: ubuntu-latest
    steps:
      # [snip…]

      - run: echo "name=doy::$(date +%j)" >> $GITHUB_ENV
        # ^^ 1 = Jan 1st, 365 = Dec 31st
      - run: echo "name=dow::$(date +%u)" >> $GITHUB_ENV
        # ^^ 1 = Monday, 7 = Sunday
      - uses: git-things-done/porter@v1
```

Which can be used in your template thusly:

```markdown
# Quotidian
- [ ] …
{% if env.doy % 2 == 0 %}
- [ ] It’s an even-day; do sit-ups
{% else %}
- [ ] It’s an odd-day; do press-ups
{% endif %}

{% if env.dow == 1 %}
# Hebdomadal
{% include "templates/mondays.md" %}
{% endif %}

This repo is `{{ github.repository }}`, the `github` variable is the workflow’s
“GitHub Context”.

The current time is: {{ timestamp | moment("Y-MM-DD, ddd, h:mm A") }}.
```

[GitTD]: https://github.com/git-things-done
[context]: https://docs.github.com/en/actions/learn-github-actions/contexts#github-context
[quotidian]: https://github.com/git-things-done/gtd/blob/main/templates/quotidian.md
[nunjucks]: https://mozilla.github.io/nunjucks/
