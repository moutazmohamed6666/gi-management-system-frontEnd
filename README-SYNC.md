# Syncing with Two Repositories

This project is configured to push to **two GitHub repositories** simultaneously.

## Repositories

1. **Origin (Primary)**: `https://github.com/moutazmohamed6666/gi-management-system-frontEnd.git`
2. **Backup (Secondary)**: `https://github.com/OmarShahiin/gi-realstate-management-system.git`

## How to Push to Both Repositories

### Option 1: Use the Script (Recommended)

```bash
./push-both.sh
```

### Option 2: Push Manually to Both

```bash
# Push to first repo
git push origin main

# Push to second repo
git push backup main
```

### Option 3: Push to Both in One Command

```bash
git push origin main && git push backup main
```

## Workflow

1. Make your changes
2. Stage your changes: `git add .`
3. Commit: `git commit -m "Your commit message"`
4. Push to both: `./push-both.sh` or use Option 2/3 above

## Pulling Changes

When pulling, you typically want to pull from the primary repository:

```bash
git pull origin main
```

If you need to pull from the backup repository:

```bash
git pull backup main
```

## Notes

- Both repositories will have the same code
- Always commit before pushing
- The script will push to both repositories sequentially
- If one push fails, the script will continue to the next one
