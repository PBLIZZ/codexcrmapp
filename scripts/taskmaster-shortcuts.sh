#!/bin/bash
# Simple Taskmaster shortcuts for parse-prd command
# Add this to your .bashrc, .zshrc, or other shell profile file

# Unalias tm if it exists
if alias tm &>/dev/null; then
  unalias tm
fi

# Main taskmaster function
tm() {
  # If no arguments, just run task-master
  if [ "$#" -eq 0 ]; then
    task-master
    return
  fi

  # Initialize variables
  local cmd_found=false
  local args=()
  
  # Process arguments
  for arg in "$@"; do
    case "$arg" in
      # Command flag for parse-prd
      -p-p)
        args+=("parse-prd")
        cmd_found=true
        ;;
      # Options for parse-prd
      -a)
        args+=("--append")
        ;;
      -r)
        args+=("--research")
        ;;
      # Handle other arguments
      -i=*)
        # Handle input file option
        args+=("--input=${arg#*=}")
        ;;
      -nt=*)
        # Handle num-tasks option
        args+=("--num-tasks=${arg#*=}")
        ;;
      *)
        # Pass through any other arguments unchanged
        args+=("$arg")
        ;;
    esac
  done

  # If no command was found, pass all args directly to task-master
  if [ "$cmd_found" = false ]; then
    task-master "$@"
  else
    # Run taskmaster with processed arguments
    task-master "${args[@]}"
  fi
}
