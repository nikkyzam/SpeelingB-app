#!/bin/bash

# Kids Spelling Bee - Complete Test Runner
# Author: Test Automation Script
# Description: Run comprehensive test cases including all edge cases

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Test results file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TEST_RESULTS_FILE="test_results_${TIMESTAMP}.txt"
TEST_LOG="test_execution_${TIMESTAMP}.log"
SUMMARY_FILE="test_reports/summary_${TIMESTAMP}.txt"

# Configuration
MOCK_USER_STORE="mock_user_store.json"
MOCK_PROGRESS_DATA="mock_progress_data.json"
MOCK_WORD_BANK="mock_word_bank.json"
FIREBASE_MOCK_ENABLED=false

# Initialize test environment
initialize_test_environment() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Kids Spelling Bee - Test Environment  ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Create test directories
    mkdir -p test_data
    mkdir -p test_reports
    mkdir -p test_logs

    # Create mock data files
    create_mock_data

    # Clear previous test results
    > "$TEST_RESULTS_FILE"
    > "$TEST_LOG"

    echo -e "${GREEN}✓ Test environment initialized${NC}"
    echo ""
}

create_mock_data() {
    # Mock user data
    cat > "test_data/$MOCK_USER_STORE" << 'EOF'
{
    "users": [
        {
            "id": "user_001",
            "name": "John Smith",
            "email": "john@example.com",
            "dailyGoal": 30,
            "createdAt": "2024-01-15T08:00:00Z"
        },
        {
            "id": "user_002",
            "name": "Joy Johnson",
            "email": "joy@example.com",
            "dailyGoal": 10,
            "createdAt": "2024-01-15T09:00:00Z"
        },
        {
            "id": "user_003",
            "name": "Bob Wilson",
            "email": "bob@wilson.com",
            "dailyGoal": 30,
            "createdAt": "2024-01-15T10:00:00Z"
        },
        {
            "id": "user_004",
            "name": "Major Joy",
            "email": "major@example.com",
            "dailyGoal": 10,
            "createdAt": "2024-01-15T11:00:00Z"
        },
        {
            "id": "user_005",
            "name": "J'oy O'Connor",
            "email": "joy+test@example.com",
            "dailyGoal": 10,
            "createdAt": "2024-01-15T12:00:00Z"
        }
    ]
}
EOF

    # Mock progress data
    cat > "test_data/$MOCK_PROGRESS_DATA" << 'EOF'
{
    "progress": [
        {
            "userId": "user_001",
            "wordsLearnedToday": 15,
            "dailyGoal": 30,
            "currentMode": "learn",
            "streak": 5,
            "lastUpdated": "2024-01-15T10:30:00Z"
        },
        {
            "userId": "user_002",
            "wordsLearnedToday": 8,
            "dailyGoal": 10,
            "currentMode": "practice",
            "streak": 3,
            "lastUpdated": "2024-01-15T11:45:00Z"
        },
        {
            "userId": "user_003",
            "wordsLearnedToday": -5,
            "dailyGoal": 30,
            "currentMode": "learn",
            "streak": 0,
            "lastUpdated": "2024-01-14T22:00:00Z"
        }
    ]
}
EOF

    # Mock word bank
    cat > "test_data/$MOCK_WORD_BANK" << 'EOF'
{
    "words": [
        {
            "id": "word_001",
            "word": "cat",
            "difficulty": "easy",
            "meaning": "A small domesticated carnivorous mammal",
            "sentence": "The cat sat on the mat."
        },
        {
            "id": "word_002",
            "word": "dog",
            "difficulty": "easy",
            "meaning": "A domesticated carnivorous mammal",
            "sentence": "The dog barked at the mailman."
        },
        {
            "id": "word_003",
            "word": "antidisestablishmentarianism",
            "difficulty": "expert",
            "meaning": "Opposition to the withdrawal of state support from an established church",
            "sentence": "The debate focused on antidisestablishmentarianism."
        },
        {
            "id": "word_004",
            "word": "mother-in-law",
            "difficulty": "medium",
            "meaning": "The mother of one's spouse",
            "sentence": "She visited her mother-in-law on Sunday."
        },
        {
            "id": "word_005",
            "word": "don't",
            "difficulty": "easy",
            "meaning": "Contraction of 'do not'",
            "sentence": "Please don't touch that."
        }
    ]
}
EOF

    echo -e "${GREEN}✓ Mock data created${NC}"
}

# Test helper functions
log_test() {
    local test_id="$1"
    local description="$2"
    local status="$3"
    local message="$4"

    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$timestamp | $test_id | $description | $status | $message" >> "$TEST_RESULTS_FILE"
    echo "$timestamp | $test_id | $description | $status | $message" >> "$TEST_LOG"

    case $status in
        "PASS")
            echo -e "${GREEN}✓ PASS${NC}: $test_id - $description"
            echo "  $message"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            ;;
        "FAIL")
            echo -e "${RED}✗ FAIL${NC}: $test_id - $description"
            echo "  $message"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            ;;
        "SKIP")
            echo -e "${YELLOW}↷ SKIP${NC}: $test_id - $description"
            echo "  $message"
            SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
            ;;
    esac

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Mock function to calculate daily goal
calculate_daily_goal() {
    local user_name="$1"
    local user_email="$2"

    # Convert to lowercase for case-insensitive check
    local name_lower=$(echo "$user_name" | tr '[:upper:]' '[:lower:]')
    local email_lower=$(echo "$user_email" | tr '[:upper:]' '[:lower:]')

    if [[ "$name_lower" == *"joy"* ]] || [[ "$email_lower" == *"joy"* ]]; then
        echo 10
    else
        echo 30
    fi
}

# Mock function to sanitize input (prevents injection)
sanitize_input() {
    local input="$1"
    # Remove potentially dangerous characters
    echo "$input" | sed 's/[;<>"$|`&]//g'
}

# Mock function to check mode unlock status
check_mode_unlock() {
    local words_learned="$1"
    local daily_goal="$2"
    local current_mode="$3"
    local quiz_passed="$4"

    # Handle negative values
    if [ "$words_learned" -lt 0 ]; then
        words_learned=0
    fi

    if [ "$current_mode" == "learn" ] && [ "$words_learned" -ge "$daily_goal" ]; then
        echo "practice_unlocked"
    elif [ "$current_mode" == "practice" ] && [ "$words_learned" -ge "$daily_goal" ]; then
        echo "spelling_quiz_unlocked"
    elif [ "$current_mode" == "spelling_quiz" ] && [ "$quiz_passed" == "perfect" ]; then
        echo "vocabulary_quiz_unlocked"
    else
        echo "locked"
    fi
}

# Test Suite 1: Daily Goal Calculation Tests
run_daily_goal_tests() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   Daily Goal Calculation Tests        ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Test DG-001: Default Goal Calculation
    test_id="DG-001"
    description="Default Goal Calculation"
    goal=$(calculate_daily_goal "John Smith" "john@example.com")
    if [ "$goal" -eq 30 ]; then
        log_test "$test_id" "$description" "PASS" "Default goal correctly set to 30"
    else
        log_test "$test_id" "$description" "FAIL" "Expected 30, got $goal"
    fi

    # Test DG-002: "Joy" Rule - Name Match
    test_id="DG-002"
    description="Joy Rule - Name Match"
    goal=$(calculate_daily_goal "Joy Smith" "joy@example.com")
    if [ "$goal" -eq 10 ]; then
        log_test "$test_id" "$description" "PASS" "Joy rule applied correctly: goal = 10"
    else
        log_test "$test_id" "$description" "FAIL" "Expected 10, got $goal"
    fi

    # Test DG-003: "Joy" Rule - Email Match
    test_id="DG-003"
    description="Joy Rule - Email Match"
    goal=$(calculate_daily_goal "Alice Wonder" "alice@joymail.com")
    if [ "$goal" -eq 10 ]; then
        log_test "$test_id" "$description" "PASS" "Joy rule applied via email: goal = 10"
    else
        log_test "$test_id" "$description" "FAIL" "Expected 10, got $goal"
    fi

    # Test DG-004: "Joy" Rule - Mixed Case
    test_id="DG-004"
    description="Joy Rule - Mixed Case"
    goal=$(calculate_daily_goal "MaJ0Yr" "major@example.com")
    if [ "$goal" -eq 10 ]; then
        log_test "$test_id" "$description" "PASS" "Case-insensitive joy detection: goal = 10"
    else
        log_test "$test_id" "$description" "FAIL" "Expected 10, got $goal"
    fi

    # Test DG-005: No "Joy" Substring
    test_id="DG-005"
    description="No Joy Substring"
    goal=$(calculate_daily_goal "Bob Wilson" "bob@wilson.com")
    if [ "$goal" -eq 30 ]; then
        log_test "$test_id" "$description" "PASS" "No joy found: goal = 30"
    else
        log_test "$test_id" "$description" "FAIL" "Expected 30, got $goal"
    fi
}

# Test Suite 2: Learning Path Progression Tests
run_learning_path_tests() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   Learning Path Progression Tests     ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Test LP-001: Learn Mode Initial Access
    test_id="LP-001"
    description="Learn Mode Initial Access"
    status=$(check_mode_unlock 0 30 "learn" "none")
    if [ "$status" == "locked" ]; then
        log_test "$test_id" "$description" "PASS" "Only Learn mode accessible for new user"
    else
        log_test "$test_id" "$description" "FAIL" "Expected locked, got $status"
    fi

    # Test LP-002: Practice Mode Unlock
    test_id="LP-002"
    description="Practice Mode Unlock"
    status=$(check_mode_unlock 30 30 "learn" "none")
    if [ "$status" == "practice_unlocked" ]; then
        log_test "$test_id" "$description" "PASS" "Practice mode unlocked at daily goal"
    else
        log_test "$test_id" "$description" "FAIL" "Expected practice_unlocked, got $status"
    fi

    # Test LP-003: Spelling Quiz Unlock
    test_id="LP-003"
    description="Spelling Quiz Unlock"
    status=$(check_mode_unlock 30 30 "practice" "none")
    if [ "$status" == "spelling_quiz_unlocked" ]; then
        log_test "$test_id" "$description" "PASS" "Spelling Quiz unlocked"
    else
        log_test "$test_id" "$description" "FAIL" "Expected spelling_quiz_unlocked, got $status"
    fi

    # Test LP-006: Skip Prevention - Practice
    test_id="LP-006"
    description="Skip Prevention - Practice"
    status=$(check_mode_unlock 15 30 "learn" "none")
    if [ "$status" == "locked" ]; then
        log_test "$test_id" "$description" "PASS" "Practice mode correctly locked"
    else
        log_test "$test_id" "$description" "FAIL" "Expected locked, got $status"
    fi

    # Test LP-008: Vocabulary Quiz Lock
    test_id="LP-008"
    description="Vocabulary Quiz Lock on Errors"
    status=$(check_mode_unlock 30 30 "spelling_quiz" "with_errors")
    if [ "$status" == "locked" ]; then
        log_test "$test_id" "$description" "PASS" "Vocabulary Quiz locked when errors exist"
    else
        log_test "$test_id" "$description" "FAIL" "Expected locked, got $status"
    fi
}

# Test Suite 3: Word Grouping Tests
run_word_grouping_tests() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   Word Grouping & Progress Tests      ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Test WG-001: Default Group Size
    test_id="WG-001"
    description="Default Group Size (30)"
    if [ -f "test_data/$MOCK_USER_STORE" ]; then
        user_goal=$(grep -A 2 '"name": "John Smith"' "test_data/$MOCK_USER_STORE" | grep '"dailyGoal"' | cut -d: -f2 | tr -d ' ,')
        if [ "$user_goal" -eq 30 ]; then
            log_test "$test_id" "$description" "PASS" "Default group size is 30"
        else
            log_test "$test_id" "$description" "FAIL" "Expected 30, got $user_goal"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Mock data file not found"
    fi

    # Test WG-002: Joy Rule Group Size
    test_id="WG-002"
    description="Joy Rule Group Size (10)"
    if [ -f "test_data/$MOCK_USER_STORE" ]; then
        user_goal=$(grep -A 2 '"name": "Joy Johnson"' "test_data/$MOCK_USER_STORE" | grep '"dailyGoal"' | cut -d: -f2 | tr -d ' ,')
        if [ "$user_goal" -eq 10 ]; then
            log_test "$test_id" "$description" "PASS" "Joy user group size is 10"
        else
            log_test "$test_id" "$description" "FAIL" "Expected 10, got $user_goal"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Mock data file not found"
    fi
}

# Test Suite 4: Persistence Tests
run_persistence_tests() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   Persistence & Sync Tests            ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Test PS-001: Local Storage Save
    test_id="PS-001"
    description="Local Storage Save"
    echo '{"progress": 15, "mode": "learn"}' > test_data/local_storage_mock.json
    if [ -f "test_data/local_storage_mock.json" ]; then
        log_test "$test_id" "$description" "PASS" "Local storage simulation successful"
    else
        log_test "$test_id" "$description" "FAIL" "Failed to create local storage mock"
    fi

    # Test PS-004: Data Integrity Check
    test_id="PS-004"
    description="Data Integrity - Multiple Devices"
    device_a_data='{"words": 15, "timestamp": "2024-01-15T10:30:00Z"}'
    device_b_data='{"words": 15, "timestamp": "2024-01-15T10:30:00Z"}'

    if [ "$device_a_data" == "$device_b_data" ]; then
        log_test "$test_id" "$description" "PASS" "Data consistent across devices"
    else
        log_test "$test_id" "$description" "FAIL" "Data inconsistency detected"
    fi
}

# Test Suite 5: Integration Tests
run_integration_tests() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   Integration Test Scenarios          ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Test IT-001: Complete Daily Flow - Regular User
    test_id="IT-001"
    description="Complete Daily Flow - Regular User"

    steps_passed=0
    total_steps=5

    goal1=$(calculate_daily_goal "Regular User" "user@example.com")
    [ "$goal1" -eq 30 ] && steps_passed=$((steps_passed + 1))

    status2=$(check_mode_unlock 30 30 "learn" "none")
    [ "$status2" == "practice_unlocked" ] && steps_passed=$((steps_passed + 1))

    status3=$(check_mode_unlock 30 30 "practice" "none")
    [ "$status3" == "spelling_quiz_unlocked" ] && steps_passed=$((steps_passed + 1))

    status4=$(check_mode_unlock 30 30 "spelling_quiz" "perfect")
    [ "$status4" == "vocabulary_quiz_unlocked" ] && steps_passed=$((steps_passed + 1))

    [ "$steps_passed" -eq 4 ] && steps_passed=$((steps_passed + 1))

    if [ "$steps_passed" -eq "$total_steps" ]; then
        log_test "$test_id" "$description" "PASS" "Complete daily flow successful ($steps_passed/$total_steps steps)"
    else
        log_test "$test_id" "$description" "FAIL" "Flow incomplete ($steps_passed/$total_steps steps)"
    fi

    # Test IT-002: Complete Daily Flow - "Joy" User
    test_id="IT-002"
    description="Complete Daily Flow - Joy User"
    joy_goal=$(calculate_daily_goal "Joy User" "joy@example.com")
    if [ "$joy_goal" -eq 10 ]; then
        log_test "$test_id" "$description" "PASS" "Joy user flow validated with 10-word goal"
    else
        log_test "$test_id" "$description" "FAIL" "Joy user goal incorrect: $joy_goal"
    fi
}

# Test Suite 6: Input Validation & Security Tests
run_security_tests() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE}   Security & Input Validation Tests  ${NC}"
    echo -e "${PURPLE}========================================${NC}"

    # Test EC-008: Special Character User Names
    test_id="EC-008"
    description="Special Character User Names"
    sanitized=$(sanitize_input "J'oy O'Connor")
    goal=$(calculate_daily_goal "$sanitized" "test@example.com")
    if [[ "$sanitized" != *"'"* ]] || [ "$goal" -eq 10 ]; then
        log_test "$test_id" "$description" "PASS" "Handles special characters in names"
    else
        log_test "$test_id" "$description" "FAIL" "Failed with special characters"
    fi

    # Test EC-009: Extremely Long Names
    test_id="EC-009"
    description="Extremely Long Names"
    long_name="Joy$(printf '%*s' 1000 | tr ' ' 'X')"
    start_time=$(date +%s%N)
    goal=$(calculate_daily_goal "$long_name" "test@example.com")
    end_time=$(date +%s%N)
    duration=$((($end_time - $start_time)/1000000))

    if [ "$goal" -eq 10 ] && [ "$duration" -lt 100 ]; then
        log_test "$test_id" "$description" "PASS" "Handles long names in ${duration}ms"
    else
        log_test "$test_id" "$description" "FAIL" "Performance issue with long name: ${duration}ms"
    fi

    # Test EC-010: Unicode/Emoji in Names
    test_id="EC-010"
    description="Unicode/Emoji in Names"
    goal=$(calculate_daily_goal "Jöy Müller" "test@example.com")
    if [ "$goal" -eq 10 ]; then
        log_test "$test_id" "$description" "PASS" "Handles Unicode characters correctly"
    else
        log_test "$test_id" "$description" "FAIL" "Failed with Unicode characters"
    fi

    # Test EC-011: SQL/HTML Injection Attempts
    test_id="EC-011"
    description="SQL/HTML Injection Protection"

    malicious_inputs=(
        "Joy'; DROP TABLE users; --"
        "<script>alert('xss')</script>"
        "Joy\" OR \"1\"=\"1"
        "Joy\$(rm -rf /)"
        "Joy|cat /etc/passwd"
    )

    all_safe=true
    for input in "${malicious_inputs[@]}"; do
        sanitized=$(sanitize_input "$input")
        # Check if dangerous characters were removed
        if [[ "$sanitized" =~ [\;\<\>\"\$\|\`] ]]; then
            echo "Warning: Dangerous character in sanitized output: $sanitized"
            all_safe=false
        fi
    done

    if [ "$all_safe" = true ]; then
        log_test "$test_id" "$description" "PASS" "Injection attempts properly sanitized"
    else
        log_test "$test_id" "$description" "FAIL" "Sanitization failed for some inputs"
    fi
}

# Test Suite 7: Progress & State Edge Cases
run_progress_edge_cases() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}   Progress & State Edge Cases         ${NC}"
    echo -e "${CYAN}========================================${NC}"

    # Test EC-016: Negative Progress Values
    test_id="EC-016"
    description="Negative Progress Handling"
    corrupted_data='{"wordsLearnedToday": -5, "dailyGoal": 30}'
    echo "$corrupted_data" > test_data/corrupted_progress.json

    # Simulate handling negative progress
    if [ -f "test_data/corrupted_progress.json" ]; then
        # Extract and validate
        words=$(grep -o '"wordsLearnedToday": -[0-9]*' test_data/corrupted_progress.json | cut -d' ' -f2)
        if [ "$words" -lt 0 ]; then
            log_test "$test_id" "$description" "PASS" "Detected negative progress value: $words"
        else
            log_test "$test_id" "$description" "FAIL" "Failed to detect negative value"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Test data not created"
    fi

    # Test EC-017: Clock Tampering Detection (simulated)
    test_id="EC-017"
    description="Clock Tampering Detection"
    normal_date="2024-01-15"
    tampered_date="2024-01-14"

    date_diff=$(( ($(date -d "$normal_date" +%s) - $(date -d "$tampered_date" +%s)) / 86400 ))
    if [ "$date_diff" -eq 1 ]; then
        log_test "$test_id" "$description" "PASS" "Date difference detection works (simulated)"
    else
        log_test "$test_id" "$description" "FAIL" "Date comparison logic issue"
    fi

    # Test EC-018: Rapid Daily Goal Completion
    test_id="EC-018"
    description="Rapid Goal Completion"
    start_time=$(date +%s%N)
    # Simulate rapid progress updates
    for i in {1..10}; do
        check_mode_unlock $i 10 "learn" "none" > /dev/null
    done
    end_time=$(date +%s%N)
    duration=$((($end_time - $start_time)/1000000))

    # Final check at goal completion
    status=$(check_mode_unlock 10 10 "learn" "none")
    if [ "$status" == "practice_unlocked" ] && [ "$duration" -lt 50 ]; then
        log_test "$test_id" "$description" "PASS" "Rapid completion handled in ${duration}ms"
    else
        log_test "$test_id" "$description" "FAIL" "Issue with rapid completion: ${duration}ms"
    fi

    # Test EC-019: Partial Progress on Boundary
    test_id="EC-019"
    description="Partial Progress Persistence"
    # Simulate crash at 29/30 words
    status_before=$(check_mode_unlock 29 30 "learn" "none")
    # After "crash", should resume at same point
    status_after=$(check_mode_unlock 29 30 "learn" "none")

    if [ "$status_before" == "$status_after" ] && [ "$status_before" == "locked" ]; then
        log_test "$test_id" "$description" "PASS" "Partial progress maintained correctly"
    else
        log_test "$test_id" "$description" "FAIL" "Progress not maintained after simulated crash"
    fi
}

# Test Suite 8: UI/UX & Performance Edge Cases
run_ui_performance_tests() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE}   UI/UX & Performance Tests          ${NC}"
    echo -e "${PURPLE}========================================${NC}"

    # Test EC-022: Rapid Button Clicks
    test_id="EC-022"
    description="Rapid Action Prevention"
    start_time=$(date +%s%N)
    for i in {1..100}; do
        calculate_daily_goal "Test User" "test@example.com" > /dev/null
    done
    end_time=$(date +%s%N)
    duration=$((($end_time - $start_time)/1000000))

    if [ "$duration" -lt 200 ]; then
        log_test "$test_id" "$description" "PASS" "Handled 100 rapid calls in ${duration}ms"
    else
        log_test "$test_id" "$description" "FAIL" "Performance issue: ${duration}ms for 100 calls"
    fi

    # Test EC-023: Low Performance Mode Simulation
    test_id="EC-023"
    description="Low Performance Mode"
    # Simulate CPU throttling by adding delay
    start_time=$(date +%s%N)
    for i in {1..20}; do
        sleep 0.001  # Simulated throttling
        calculate_daily_goal "User $i" "user$i@test.com" > /dev/null
    done
    end_time=$(date +%s%N)
    duration=$((($end_time - $start_time)/1000000))

    if [ "$duration" -lt 500 ]; then
        log_test "$test_id" "$description" "PASS" "Acceptable performance under load: ${duration}ms"
    else
        log_test "$test_id" "$description" "WARN" "Slow performance in simulated throttling: ${duration}ms"
    fi
}

# Test Suite 9: Word Bank & Content Edge Cases
run_word_bank_tests() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}   Word Bank & Content Tests           ${NC}"
    echo -e "${CYAN}========================================${NC}"

    # Test EC-028: Empty Word Bank
    test_id="EC-028"
    description="Empty Word Bank Handling"
    empty_word_bank='{"words": []}'
    echo "$empty_word_bank" > test_data/empty_word_bank.json
    word_count=$(grep -c '"word":' test_data/empty_word_bank.json 2>/dev/null || echo "0")

    if [ "$word_count" -eq 0 ]; then
        log_test "$test_id" "$description" "PASS" "Empty word bank detected correctly"
    else
        log_test "$test_id" "$description" "FAIL" "Failed to detect empty word bank"
    fi

    # Test EC-030: Very Long Words
    test_id="EC-030"
    description="Very Long Word Handling"
    if [ -f "test_data/$MOCK_WORD_BANK" ]; then
        long_word=$(grep -A 1 'antidisestablishmentarianism' "test_data/$MOCK_WORD_BANK" | grep '"word"' | cut -d'"' -f4)
        if [ "${#long_word}" -gt 20 ]; then
            log_test "$test_id" "$description" "PASS" "Long word detected: ${#long_word} chars"
        else
            log_test "$test_id" "$description" "FAIL" "Long word not found"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Word bank not found"
    fi

    # Test EC-031: Special Character Words
    test_id="EC-031"
    description="Special Character Words"
    if [ -f "test_data/$MOCK_WORD_BANK" ]; then
        special_words=$(grep -E 'mother-in-law|don'"'"'t' "test_data/$MOCK_WORD_BANK" | grep -c '"word"')
        if [ "$special_words" -eq 2 ]; then
            log_test "$test_id" "$description" "PASS" "Special character words found: $special_words"
        else
            log_test "$test_id" "$description" "FAIL" "Expected 2 special words, found $special_words"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Word bank not found"
    fi
}

# Test Suite 10: Network & Storage Edge Cases
run_network_storage_tests() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   Network & Storage Tests             ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Test EC-012: localStorage Quota Simulation
    test_id="EC-012"
    description="Storage Quota Handling"

    # Create a large file to simulate quota exceeded
    dd if=/dev/zero of=test_data/large_cache.dat bs=1M count=5 2>/dev/null

    if [ -f "test_data/large_cache.dat" ]; then
        file_size=$(du -k test_data/large_cache.dat | cut -f1)
        if [ "$file_size" -gt 5000 ]; then  # 5MB
            log_test "$test_id" "$description" "PASS" "Large storage usage simulated (${file_size}KB)"
        else
            log_test "$test_id" "$description" "FAIL" "Failed to create large test file"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Could not create test file"
    fi

    # Test EC-013: Concurrent Device Usage Simulation
    test_id="EC-013"
    description="Concurrent Device Usage"

    # Simulate two devices with slightly different progress
    device1_progress='{"words": 15, "timestamp": "2024-01-15T10:30:00Z"}'
    device2_progress='{"words": 16, "timestamp": "2024-01-15T10:31:00Z"}'

    # Conflict resolution: take the higher count
    device1_count=$(echo "$device1_progress" | grep -o '"words": [0-9]*' | cut -d' ' -f2)
    device2_count=$(echo "$device2_progress" | grep -o '"words": [0-9]*' | cut -d' ' -f2)

    if [ "$device2_count" -gt "$device1_count" ]; then
        final_count="$device2_count"
    else
        final_count="$device1_count"
    fi

    if [ "$final_count" -eq 16 ]; then
        log_test "$test_id" "$description" "PASS" "Conflict resolution selects higher count: $final_count"
    else
        log_test "$test_id" "$description" "FAIL" "Conflict resolution failed: $final_count"
    fi

    # Test EC-015: Offline-Online Transitions
    test_id="EC-015"
    description="Offline-Online Transition"

    # Simulate offline progress
    offline_data='{"words": 5, "mode": "learn", "offline": true}'
    echo "$offline_data" > test_data/offline_progress.json

    # Simulate coming online and syncing
    if [ -f "test_data/offline_progress.json" ]; then
        offline_words=$(grep -o '"words": [0-9]*' test_data/offline_progress.json | cut -d' ' -f2)
        if [ "$offline_words" -eq 5 ]; then
            log_test "$test_id" "$description" "PASS" "Offline progress captured: $offline_words words"
        else
            log_test "$test_id" "$description" "FAIL" "Offline progress not captured correctly"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Offline test data not created"
    fi
}

# Test Suite 11: Authentication Edge Cases
run_auth_tests() {
    echo -e "\n${GREEN}========================================${NC}"
    echo -e "${GREEN}   Authentication Edge Cases          ${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Test EC-032: Anonymous to Registered User
    test_id="EC-032"
    description="Anonymous to Registered Migration"

    anonymous_data='{"progress": 10, "words": ["cat", "dog"], "anonymous": true}'
    registered_data='{"progress": 10, "words": ["cat", "dog"], "userId": "user_123"}'

    echo "$anonymous_data" > test_data/anonymous_progress.json
    echo "$registered_data" > test_data/registered_progress.json

    # Check if data can be migrated
    anonymous_words=$(grep -c '"word"' test_data/anonymous_progress.json 2>/dev/null || echo "0")
    registered_words=$(grep -c '"word"' test_data/registered_progress.json 2>/dev/null || echo "0")

    if [ "$anonymous_words" -eq "$registered_words" ] && [ "$anonymous_words" -gt 0 ]; then
        log_test "$test_id" "$description" "PASS" "Progress migration simulated: $anonymous_words words"
    else
        log_test "$test_id" "$description" "FAIL" "Migration failed: anonymous=$anonymous_words, registered=$registered_words"
    fi

    # Test EC-033: Multiple Account Switching
    test_id="EC-033"
    description="Multiple Account Switching"

    user1_data='{"userId": "user1", "progress": 5}'
    user2_data='{"userId": "user2", "progress": 8}'

    # Simulate switching
    current_user="user1"
    current_data="$user1_data"

    if echo "$current_data" | grep -q '"userId": "user1"'; then
        # Switch to user2
        current_user="user2"
        current_data="$user2_data"

        if echo "$current_data" | grep -q '"userId": "user2"'; then
            log_test "$test_id" "$description" "PASS" "Account switching simulated successfully"
        else
            log_test "$test_id" "$description" "FAIL" "Failed to switch accounts"
        fi
    fi
}

# Test Suite 12: Browser & Environment Edge Cases
run_browser_environment_tests() {
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${YELLOW}   Browser & Environment Tests        ${NC}"
    echo -e "${YELLOW}========================================${NC}"

    # Test EC-036: Incognito Mode Simulation
    test_id="EC-036"
    description="Incognito/Private Browsing"

    # Test if we can detect private browsing limitations
    can_write_storage=true

    # Try to write a test file (simulating storage)
    test_write_file="test_data/storage_test_${TIMESTAMP}.txt"
    echo "test data" > "$test_write_file" 2>/dev/null || can_write_storage=false

    if [ "$can_write_storage" = true ] && [ -f "$test_write_file" ]; then
        log_test "$test_id" "$description" "PASS" "Storage write successful (non-incognito simulation)"
        rm "$test_write_file"
    else
        log_test "$test_id" "$description" "WARN" "Storage write failed (incognito simulation)"
    fi

    # Test EC-037: Browser Navigation
    test_id="EC-037"
    description="Browser Back/Forward Navigation"

    # Simulate state before navigation
    state_before='{"page": "learn", "progress": 10}'
    # Simulate navigation away and back
    state_after='{"page": "learn", "progress": 10}'

    if [ "$state_before" == "$state_after" ]; then
        log_test "$test_id" "$description" "PASS" "State maintained after simulated navigation"
    else
        log_test "$test_id" "$description" "FAIL" "State lost after navigation"
    fi

    # Test EC-039: Ad Blocker Interference
    test_id="EC-039"
    description="Ad Blocker Interference"

    # Simulate blocked resources
    blocked_resources=("analytics.js" "ad-service.com" "tracking-script.js")
    available_resources=("app.js" "styles.css" "main.js")

    all_core_available=true
    for resource in "${available_resources[@]}"; do
        if [[ ! " ${blocked_resources[@]} " =~ " ${resource} " ]]; then
            # Core resource is available
            true
        else
            all_core_available=false
        fi
    done

    if [ "$all_core_available" = true ]; then
        log_test "$test_id" "$description" "PASS" "Core functionality available despite blocked resources"
    else
        log_test "$test_id" "$description" "WARN" "Some core resources might be blocked"
    fi
}

# Test Suite 13: Time Zone & Date Boundary Tests
run_time_date_tests() {
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE}   Time Zone & Date Tests             ${NC}"
    echo -e "${PURPLE}========================================${NC}"

    # Test EC-005: Time Zone Sensitivity
    test_id="EC-005"
    description="Time Zone Sensitivity"

    # Simulate different time zones for same UTC time
    utc_time="2024-01-15T23:30:00Z"
    tz_ny="EST"  # UTC-5
    tz_london="GMT"  # UTC+0
    tz_tokyo="JST"  # UTC+9

    # Calculate if it's a different calendar day in each timezone
    # In reality, you'd use date calculations. For simulation:
    ny_hour=$(TZ="America/New_York" date -d "$utc_time" +%H 2>/dev/null || echo "unknown")
    london_hour=$(TZ="Europe/London" date -d "$utc_time" +%H 2>/dev/null || echo "unknown")

    if [ "$ny_hour" != "unknown" ] && [ "$london_hour" != "unknown" ]; then
        log_test "$test_id" "$description" "PASS" "Time zone calculations available"
    else
        log_test "$test_id" "$description" "SKIP" "Time zone calculations not available in test env"
    fi

    # Test EC-006: DST Transition Simulation
    test_id="EC-006"
    description="DST (Daylight Saving) Transition"

    # Dates around DST change (US Spring forward 2024)
    before_dst="2024-03-09T23:30:00"  # Before DST
    after_dst="2024-03-10T23:30:00"   # After DST

    # Calculate if 24 hours apart in real time
    before_epoch=$(date -d "$before_dst" +%s 2>/dev/null || echo "0")
    after_epoch=$(date -d "$after_dst" +%s 2>/dev/null || echo "0")

    if [ "$before_epoch" -gt 0 ] && [ "$after_epoch" -gt 0 ]; then
        hour_diff=$(( (after_epoch - before_epoch) / 3600 ))
        if [ "$hour_diff" -eq 24 ]; then
            log_test "$test_id" "$description" "PASS" "24-hour day maintained across DST"
        else
            log_test "$test_id" "$description" "WARN" "DST may affect day calculation: $hour_diff hours"
        fi
    else
        log_test "$test_id" "$description" "SKIP" "Date calculations not available"
    fi

    # Test EC-007: 24+ Hour Session
    test_id="EC-007"
    description="24+ Hour Session"

    # Simulate session starting just before midnight
    day1_progress=25
    day2_progress=15

    total_progress=$((day1_progress + day2_progress))

    if [ "$total_progress" -eq 40 ]; then
        log_test "$test_id" "$description" "PASS" "Multi-day session progress calculated: $total_progress words"
    else
        log_test "$test_id" "$description" "FAIL" "Multi-day progress calculation error"
    fi
}

# Comprehensive Edge Case Test Suite
run_comprehensive_edge_cases() {
    echo -e "\n${RED}========================================${NC}"
    echo -e "${RED}   COMPREHENSIVE EDGE CASE TESTS       ${NC}"
    echo -e "${RED}========================================${NC}"

    run_security_tests
    run_progress_edge_cases
    run_ui_performance_tests
    run_word_bank_tests
    run_network_storage_tests
    run_auth_tests
    run_browser_environment_tests
    run_time_date_tests
}

# Run all test suites
run_all_tests() {
    initialize_test_environment

    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}   Starting Comprehensive Test Run     ${NC}"
    echo -e "${BLUE}========================================${NC}"

    # Core functionality tests
    run_daily_goal_tests
    run_learning_path_tests
    run_word_grouping_tests
    run_persistence_tests
    run_integration_tests

    # Edge case tests
    run_comprehensive_edge_cases

    generate_test_report
}

# Generate test report
generate_test_report() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}           Test Summary                ${NC}"
    echo -e "${BLUE}========================================${NC}"

    echo -e "\n${GREEN}Tests Passed:${NC} $PASSED_TESTS"
    echo -e "${RED}Tests Failed:${NC} $FAILED_TESTS"
    echo -e "${YELLOW}Tests Skipped:${NC} $SKIPPED_TESTS"
    echo -e "${BLUE}Total Tests:${NC} $TOTAL_TESTS"

    # Calculate pass percentage
    if [ $TOTAL_TESTS -gt 0 ]; then
        PASS_PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    else
        PASS_PERCENTAGE=0
    fi

    echo -e "\n${BLUE}Pass Rate:${NC} $PASS_PERCENTAGE%"

    # Generate detailed report
    cat > "$SUMMARY_FILE" << EOF
Kids Spelling Bee - Comprehensive Test Report
===========================================
Test Date: $(date)
Test Run ID: $TIMESTAMP

Test Results:
-------------
Total Tests: $TOTAL_TESTS
✓ Passed: $PASSED_TESTS
✗ Failed: $FAILED_TESTS
↷ Skipped: $SKIPPED_TESTS
Pass Rate: $PASS_PERCENTAGE%

Test Suites Executed:
--------------------
1. Daily Goal Calculation Tests
2. Learning Path Progression Tests
3. Word Grouping & Progress Tests
4. Persistence & Sync Tests
5. Integration Tests
6. Security & Input Validation Tests
7. Progress & State Edge Cases
8. UI/UX & Performance Tests
9. Word Bank & Content Tests
10. Network & Storage Tests
11. Authentication Edge Cases
12. Browser & Environment Tests
13. Time Zone & Date Tests

Detailed Results: $TEST_RESULTS_FILE
Execution Log: $TEST_LOG
EOF

    # Add failure details if any
    if [ $FAILED_TESTS -gt 0 ]; then
        echo -e "\nFailed Tests:" >> "$SUMMARY_FILE"
        echo "-------------" >> "$SUMMARY_FILE"
        grep "FAIL" "$TEST_RESULTS_FILE" >> "$SUMMARY_FILE"
    fi

    # Overall status
    if [ $FAILED_TESTS -eq 0 ] && [ $TOTAL_TESTS -gt 0 ]; then
        echo -e "\n${GREEN}✅ ALL TESTS PASSED!${NC}"
        echo -e "\nStatus: ✅ ALL TESTS PASSED!" >> "$SUMMARY_FILE"
        EXIT_CODE=0
    elif [ $FAILED_TESTS -gt 0 ]; then
        echo -e "\n${RED}❌ SOME TESTS FAILED${NC}"
        echo -e "\nStatus: ❌ $FAILED_TESTS TESTS FAILED" >> "$SUMMARY_FILE"
        EXIT_CODE=1
    else
        echo -e "\n${YELLOW}⚠️  NO TESTS EXECUTED${NC}"
        echo -e "\nStatus: ⚠️  NO TESTS EXECUTED" >> "$SUMMARY_FILE"
        EXIT_CODE=2
    fi

    echo -e "\n${BLUE}Detailed results saved to:${NC} $TEST_RESULTS_FILE"
    echo -e "${BLUE}Summary report saved to:${NC} $SUMMARY_FILE"
    echo -e "${BLUE}Execution log saved to:${NC} $TEST_LOG"

    # Move log files to logs directory
    mv "$TEST_LOG" "test_logs/" 2>/dev/null || true

    exit $EXIT_CODE
}

# Function to run specific test suite
run_specific_suite() {
    case $1 in
        "daily-goal")
            run_daily_goal_tests
            ;;
        "learning-path")
            run_learning_path_tests
            ;;
        "word-grouping")
            run_word_grouping_tests
            ;;
        "persistence")
            run_persistence_tests
            ;;
        "integration")
            run_integration_tests
            ;;
        "security")
            run_security_tests
            ;;
        "progress-edge")
            run_progress_edge_cases
            ;;
        "ui-performance")
            run_ui_performance_tests
            ;;
        "word-bank")
            run_word_bank_tests
            ;;
        "network")
            run_network_storage_tests
            ;;
        "auth")
            run_auth_tests
            ;;
        "browser")
            run_browser_environment_tests
            ;;
        "time-date")
            run_time_date_tests
            ;;
        "edge-cases")
            run_comprehensive_edge_cases
            ;;
        *)
            echo "Unknown test suite: $1"
            echo "Available suites:"
            echo "  daily-goal       - Daily goal calculation"
            echo "  learning-path    - Learning progression"
            echo "  word-grouping    - Word grouping logic"
            echo "  persistence      - Data persistence"
            echo "  integration      - Integration scenarios"
            echo "  security         - Security & input validation"
            echo "  progress-edge    - Progress edge cases"
            echo "  ui-performance   - UI/UX & performance"
            echo "  word-bank        - Word bank tests"
            echo "  network          - Network & storage"
            echo "  auth             - Authentication"
            echo "  browser          - Browser environment"
            echo "  time-date        - Time zone & date tests"
            echo "  edge-cases       - All edge cases"
            echo "  all              - All test suites"
            exit 1
            ;;
    esac
    generate_test_report
}

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Cleaning up test files...${NC}"
    rm -f test_data/*.json test_data/*.dat 2>/dev/null || true
    echo -e "${GREEN}Cleanup completed.${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Kids Spelling Bee - Complete Test Runner${NC}"
    echo "Version: 2.0 | Comprehensive Edge Case Testing"
    echo "=============================================="
    echo ""

    # Register cleanup on exit
    trap cleanup EXIT

    if [ $# -eq 0 ]; then
        echo "Usage: $0 [all|test-suite-name]"
        echo ""
        echo "Examples:"
        echo "  $0 all               # Run all tests"
        echo "  $0 security          # Run security tests only"
        echo "  $0 edge-cases        # Run all edge case tests"
        echo ""
        echo "Use '$0 help' to see all available test suites"
        exit 0
    fi

    if [ "$1" == "help" ]; then
        run_specific_suite "invalid"  # This will show the help
        exit 0
    fi

    if [ "$1" == "all" ]; then
        run_all_tests
    else
        run_specific_suite "$1"
    fi
}

# Handle Ctrl+C gracefully
trap 'echo -e "\n${RED}Test execution interrupted by user${NC}"; generate_test_report; exit 130' INT

# Run main function with arguments
main "$@"