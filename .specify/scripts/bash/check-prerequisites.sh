#!/usr/bin/env bash

# Consolidated prerequisite checking script
#
# This script provides unified prerequisite checking for Spec-Driven Development workflow.
# It replaces the functionality previously spread across multiple scripts.
#
# Usage: ./check-prerequisites.sh [OPTIONS]
#
# OPTIONS:
#   --version           Show version information
#   --json              Output in JSON format
#   --require-tasks     Require tasks.md to exist (for implementation phase)
#   --include-tasks     Include tasks.md in AVAILABLE_DOCS list
#   --paths-only        Only output path variables (no validation)
#   --verbose           Enable verbose output
#   --log-level=LEVEL   Set log level (debug, info, warn, error) [default: info]
#   --config=PATH       Use specific configuration file
#   --output=PATH       Write output to specified file
#   --strict            Enable strict mode (treat warnings as errors)
#   --force             Force execution despite some errors
#   --skip-dependencies Skip dependency checks
#   --install-missing   Attempt to install missing dependencies
#   --dry-run           Show what would be checked without performing actions
#   --timeout=DURATION  Set a timeout for the script (e.g., 30s, 5m)
#   --help, -h          Show help message

set -e

VERSION="1.1.0"

# Default values
JSON_MODE=false
REQUIRE_TASKS=false
INCLUDE_TASKS=false
PATHS_ONLY=false
VERBOSE=false
LOG_LEVEL="info"
CONFIG_FILE=""
OUTPUT_FILE=""
STRICT=false
FORCE=false
SKIP_DEPS=false
INSTALL_MISSING=false
DRY_RUN=false
TIMEOUT_VAL=""

# Logging function
log() {
    local level=$1
    shift
    local msg="$*"
    
    # Priority mapping
    declare -A levels=([debug]=0 [info]=1 [warn]=2 [error]=3)
    local current_priority=${levels[$LOG_LEVEL]:-1}
    local msg_priority=${levels[$level]:-1}

    if [ "$msg_priority" -ge "$current_priority" ]; then
        if [ "$level" == "error" ]; then
            echo "ERROR: $msg" >&2
        elif [ "$level" == "warn" ]; then
            echo "WARN: $msg" >&2
        else
            echo "[$level] $msg"
        fi
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --version)
            echo "check-prerequisites.sh v$VERSION"
            exit 0
            ;;
        --json)
            JSON_MODE=true
            shift
            ;;
        --require-tasks)
            REQUIRE_TASKS=true
            shift
            ;;
        --include-tasks)
            INCLUDE_TASKS=true
            shift
            ;;
        --paths-only)
            PATHS_ONLY=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            LOG_LEVEL="debug"
            shift
            ;;
        --log-level=*)
            LOG_LEVEL="${1#*=}"
            shift
            ;;
        --log-level)
            LOG_LEVEL="$2"
            shift 2
            ;;
        --config=*)
            CONFIG_FILE="${1#*=}"
            shift
            ;;
        --config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        --output=*)
            OUTPUT_FILE="${1#*=}"
            shift
            ;;
        --output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --strict)
            STRICT=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --skip-dependencies)
            SKIP_DEPS=true
            shift
            ;;
        --install-missing)
            INSTALL_MISSING=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --timeout=*)
            TIMEOUT_VAL="${1#*=}"
            shift
            ;;
        --timeout)
            TIMEOUT_VAL="$2"
            shift 2
            ;;
        --help|-h)
            cat << 'EOF'
Usage: check-prerequisites.sh [OPTIONS]

Consolidated prerequisite checking for Spec-Driven Development workflow.

OPTIONS:
  --version           Show version information
  --json              Output in JSON format
  --require-tasks     Require tasks.md to exist (for implementation phase)
  --include-tasks     Include tasks.md in AVAILABLE_DOCS list
  --paths-only        Only output path variables (no prerequisite validation)
  --verbose           Enable verbose output
  --log-level=LEVEL   Set log level (debug, info, warn, error) [default: info]
  --config=PATH       Use specific configuration file
  --output=PATH       Write output to specified file
  --strict            Enable strict mode (treat warnings as errors)
  --force             Force execution despite some errors
  --skip-dependencies Skip dependency checks
  --install-missing   Attempt to install missing dependencies
  --dry-run           Show what would be checked without performing actions
  --timeout=DURATION  Set a timeout for the script (e.g., 30s, 5m)
  --help, -h          Show this help message

EXAMPLES:
  # Check task prerequisites (plan.md required)
  ./check-prerequisites.sh --json
  
  # Check implementation prerequisites (plan.md + tasks.md required)
  ./check-prerequisites.sh --json --require-tasks --include-tasks
  
  # Get feature paths only (no validation)
  ./check-prerequisites.sh --paths-only
  
EOF
            exit 0
            ;;
        *)
            echo "ERROR: Unknown option '$1'. Use --help for usage information." >&2
            exit 1
            ;;
    esac
done

# Apply timeout if requested
if [[ -n "$TIMEOUT_VAL" ]] && [[ "${INTERNAL_TIMEOUT_WRAPPER:-}" != "true" ]] && command -v timeout >/dev/null 2>&1; then
    log debug "Applying timeout: $TIMEOUT_VAL"
    export INTERNAL_TIMEOUT_WRAPPER=true
    exec timeout "$TIMEOUT_VAL" "$0" "$@"
fi

# Redirect output if requested
if [[ -n "$OUTPUT_FILE" ]]; then
    exec > "$OUTPUT_FILE"
fi

# Source common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ ! -f "$SCRIPT_DIR/common.sh" ]]; then
    echo "ERROR: common.sh not found in $SCRIPT_DIR" >&2
    exit 1
fi
source "$SCRIPT_DIR/common.sh"

if $DRY_RUN; then
    log info "Dry run enabled. No actions will be performed."
fi

# Check dependencies if not skipped
if ! $SKIP_DEPS; then
    log debug "Checking dependencies..."
    
    deps=("git" "node" "pnpm" "uv")
    missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" >/dev/null 2>&1; then
            missing+=("$dep")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        if $INSTALL_MISSING; then
            log warn "Missing dependencies: ${missing[*]}. Attempting to install is not implemented yet."
        else
            log error "Missing dependencies: ${missing[*]}"
            if ! $FORCE; then
                exit 1
            fi
        fi
    fi
fi

# Get feature paths and validate branch
eval $(get_feature_paths)
if ! check_feature_branch "$CURRENT_BRANCH" "$HAS_GIT"; then
    if $STRICT; then
        log error "Strict mode: branch validation failed."
        exit 1
    elif ! $FORCE; then
        exit 1
    fi
fi

# If paths-only mode, output paths and exit (support JSON + paths-only combined)
if $PATHS_ONLY; then
    if $JSON_MODE; then
        # Minimal JSON paths payload (no validation performed)
        printf '{"REPO_ROOT":"%s","BRANCH":"%s","FEATURE_DIR":"%s","FEATURE_SPEC":"%s","IMPL_PLAN":"%s","TASKS":"%s"}\n' \
            "$REPO_ROOT" "$CURRENT_BRANCH" "$FEATURE_DIR" "$FEATURE_SPEC" "$IMPL_PLAN" "$TASKS"
    else
        echo "REPO_ROOT: $REPO_ROOT"
        echo "BRANCH: $CURRENT_BRANCH"
        echo "FEATURE_DIR: $FEATURE_DIR"
        echo "FEATURE_SPEC: $FEATURE_SPEC"
        echo "IMPL_PLAN: $IMPL_PLAN"
        echo "TASKS: $TASKS"
    fi
    exit 0
fi

# Validate required directories and files
if [[ ! -d "$FEATURE_DIR" ]]; then
    log error "Feature directory not found: $FEATURE_DIR"
    log info "Run /speckit.specify first to create the feature structure."
    if ! $FORCE; then exit 1; fi
fi

if [[ ! -f "$IMPL_PLAN" ]]; then
    log error "plan.md not found in $FEATURE_DIR"
    log info "Run /speckit.plan first to create the implementation plan."
    if ! $FORCE; then exit 1; fi
fi

# Check for tasks.md if required
if $REQUIRE_TASKS && [[ ! -f "$TASKS" ]]; then
    log error "tasks.md not found in $FEATURE_DIR"
    log info "Run /speckit.tasks first to create the task list."
    if ! $FORCE; then exit 1; fi
fi

# Build list of available documents
docs=()

# Always check these optional docs
[[ -f "$RESEARCH" ]] && docs+=("research.md")
[[ -f "$DATA_MODEL" ]] && docs+=("data-model.md")

# Check contracts directory (only if it exists and has files)
if [[ -d "$CONTRACTS_DIR" ]] && [[ -n "$(ls -A "$CONTRACTS_DIR" 2>/dev/null)" ]]; then
    docs+=("contracts/")
fi

[[ -f "$QUICKSTART" ]] && docs+=("quickstart.md")

# Include tasks.md if requested and it exists
if $INCLUDE_TASKS && [[ -f "$TASKS" ]]; then
    docs+=("tasks.md")
fi

# Output results
if $JSON_MODE; then
    # Build JSON array of documents
    if [[ ${#docs[@]} -eq 0 ]]; then
        json_docs="[]"
    else
        json_docs=$(printf '"%s",' "${docs[@]}")
        json_docs="[${json_docs%,}]"
    fi
    
    printf '{"FEATURE_DIR":"%s","AVAILABLE_DOCS":%s}\n' "$FEATURE_DIR" "$json_docs"
else
    # Text output
    echo "FEATURE_DIR:$FEATURE_DIR"
    echo "AVAILABLE_DOCS:"
    
    # Show status of each potential document
    check_file "$RESEARCH" "research.md"
    check_file "$DATA_MODEL" "data-model.md"
    check_dir "$CONTRACTS_DIR" "contracts/"
    check_file "$QUICKSTART" "quickstart.md"
    
    if $INCLUDE_TASKS; then
        check_file "$TASKS" "tasks.md"
    fi
fi
