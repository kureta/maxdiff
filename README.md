# `maxdiff`: A visual diff viewer for Max patches

[Screenshot](img/maxdiff.png)

- Works with Max patches (`*.maxpat`) and Max4Live devices (`*.amxd`)
- Works both with `git diff` and as a standalone diff tool.
- Shows added, removed, modified, unchaged, only moved/resized objects.
- Shows objects added to/removed from presentation view.
- Handles embedded subpatches.
- Shows metadata changes.
- Shows changes that have no effect on how a patch works or looks (visually
  ignored changes)

## Use with `git diff`

Add this to your `.gitconfig`:

```toml
[diff "maxdiff"]
    command = python3 /path/to/maxdiff.py
[difftool "maxdiff"]
    cmd = python3 /path/to/maxdiff.py \"$LOCAL\" \"$REMOTE\"
```

And add this to your `.gitattributes`:

```
*.maxpat diff=maxdiff
*.amxd diff=maxdiff
```

## Standalone use

`python maxdiff.py file-1.maxpat file-2.maxpat`
