
#!/usr/bin/env bash

set -euo pipefail

# Files to generate inside each module
FILES=(
  "services.ts"
  "controller.ts"
  "type.ts"
  "validation.ts"
  "routes.ts"
)

echo "🚀 Generating module structure..."

for MODULE in */; do

  # Skip if no directories exist
  [[ -d "$MODULE" ]] || continue

  MODULE_NAME="${MODULE%/}"

  echo ""
  echo "📦 Module: $MODULE_NAME"

  for FILE in "${FILES[@]}"; do

    FILE_PATH="${MODULE}${FILE}"

    if [[ -f "$FILE_PATH" ]]; then
      echo "  ⏭️  Skipped: $FILE"
    else
      touch "$FILE_PATH"
      echo "  ✅ Created: $FILE"
    fi

  done

done

echo ""
echo "🎉 Module structure generated successfully!"
