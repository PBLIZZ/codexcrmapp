#!/bin/bash
# Emergency config restoration
echo "Restoring configs from .recovery/configs/"
for file in .recovery/configs/*.backup; do
  original="${file%.backup}"
  original="${original##*/}"
  cp "$file" "$original"
  echo "Restored: $original"
done