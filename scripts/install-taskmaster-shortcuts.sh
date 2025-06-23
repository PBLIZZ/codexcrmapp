#!/bin/bash
# Installation script for Taskmaster shortcuts

# Determine shell type
SHELL_CONFIG=""
if [[ "$SHELL" == */zsh ]]; then
  SHELL_CONFIG="$HOME/.zshrc"
  echo "Detected zsh shell"
elif [[ "$SHELL" == */bash ]]; then
  if [[ -f "$HOME/.bashrc" ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
  else
    SHELL_CONFIG="$HOME/.bash_profile"
  fi
  echo "Detected bash shell"
else
  echo "Unsupported shell: $SHELL"
  echo "Please manually add the shortcuts to your shell configuration file"
  exit 1
fi

# Get the full path of the taskmaster shortcuts script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SHORTCUTS_SCRIPT="$SCRIPT_DIR/taskmaster-shortcuts.sh"

# Check if the shortcuts script exists
if [[ ! -f "$SHORTCUTS_SCRIPT" ]]; then
  echo "Error: $SHORTCUTS_SCRIPT not found"
  exit 1
fi

# Make the scripts executable
chmod +x "$SHORTCUTS_SCRIPT"
chmod +x "$0"

# Check if shortcuts are already installed
if grep -q "source.*taskmaster-shortcuts.sh" "$SHELL_CONFIG"; then
  echo "Taskmaster shortcuts are already installed in $SHELL_CONFIG"
else
  echo "" >> "$SHELL_CONFIG"
  echo "# Taskmaster shortcuts" >> "$SHELL_CONFIG"
  echo "source \"$SHORTCUTS_SCRIPT\"" >> "$SHELL_CONFIG"
  echo "Taskmaster shortcuts have been installed in $SHELL_CONFIG"
fi

echo ""
echo "Installation complete!"
echo "To start using the shortcuts immediately, run:"
echo "  source \"$SHORTCUTS_SCRIPT\""
echo ""
echo "Otherwise, restart your terminal or run:"
echo "  source \"$SHELL_CONFIG\""
echo ""
echo "
Usage Examples:
"

echo "# Parse PRD Command"
echo "  tm                                   # Run taskmaster with no arguments"
echo "  tm -p-p -i=prd.txt -nt=5            # task-master parse-prd --input=prd.txt --num-tasks=5"
echo "  tm -p-p -i=prd.txt -r -a            # task-master parse-prd --input=prd.txt --research --append"
echo "  tm -p-p -i=prd.txt -nt=10 -r -a     # task-master parse-prd --input=prd.txt --num-tasks=10 --research --append"

echo "
# Options Explained"
echo "  -p-p                               # Command shortcut for parse-prd"
echo "  -i=<file.txt>                     # Specify input file (--input)"
echo "  -nt=<number>                      # Set number of tasks (--num-tasks)"
echo "  -r                                # Enable research mode (--research)"
echo "  -a                                # Enable append mode (--append)"

echo "
# Direct Command Usage"
echo "  tm list                            # Any regular taskmaster command works normally too"
