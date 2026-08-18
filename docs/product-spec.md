# Pomodoro Product Specification

**Document type:** As-built reference  
**Baseline:** `master` at commit `5120909`  
**Status:** Implemented

## 1. Product Overview

Pomodoro helps a user plan a small set of daily focus tasks, work in timed
sessions, take structured breaks, and review completed focus activity. The main
screen keeps the timer and the currently selected task visible together so the
user can move between planning and focusing without changing pages.

The application supports two data contexts:

- An anonymous visitor keeps daily focus tasks in the current browser.
- A signed-in user stores focus tasks and completed Pomodoro sessions in the
  application database and can view recent statistics.

Timer preferences are browser-specific in both contexts.

## 2. User Scenarios

### 2.1 Complete a Pomodoro

1. The user opens the Pomodoro tab.
2. The user optionally selects a focus task.
3. The user starts, pauses, resumes, or resets the timer as needed.
4. When the configured duration elapses, the application records the
   completion in the active data context.
5. The application presents choices to take a short break or continue
   focusing.

When a task is active, a completed Pomodoro advances that task by one session.
When its completed count reaches its estimate, the task is complete and is no
longer kept as the active task.

### 2.2 Plan daily focus tasks

1. The user creates a task with a title, optional description, and an estimate
   from one to eight Pomodoros.
2. The task appears in the current day's task list.
3. The user can filter the list by task status and select a task to view its
   details.
4. An incomplete task can be edited, and any task can be deleted.

Task-list selection is disabled while a timer is actively running.

### 2.3 Use structured breaks

The user can switch directly to either break timer or choose a break after a
completed session:

- Short break: 5 minutes
- Long break: 15 minutes

Completing a break returns the user to the completion view, where another
Pomodoro or break can be selected.

### 2.4 Review focus activity

A signed-in user can open the statistics page and review completed Pomodoro
sessions from the latest seven local calendar days. The page provides:

- A daily session-count chart
- A per-task distribution for the selected day
- General Pomodoro guidance

Sessions completed without an active task still contribute to the daily count.

### 2.5 Configure the timer

The user can set:

- Pomodoro duration from 1 to 60 whole minutes
- Notification volume from 0% to 100%

The initial Pomodoro duration is 25 minutes and the initial notification volume
is 35%. Settings persist in the browser.

### 2.6 Sign in

The application offers Google sign-in. A successful session enables
database-backed focus tasks, daily Pomodoro counts, and the statistics page.
Signing out returns the application to its anonymous browser-backed context.

## 3. Functional Requirements

### Timer

- **FR-T01:** The application MUST provide Pomodoro, short-break, and long-break
  timers.
- **FR-T02:** A timer MUST support start, pause, resume, and reset actions.
- **FR-T03:** The displayed time MUST represent the remaining duration.
- **FR-T04:** Changing timer tabs MUST begin that timer from its initial state.
- **FR-T05:** A completed timer MUST trigger its completion behavior once.
- **FR-T06:** The application MUST offer another focus session or a break after
  completion.

### Focus tasks

- **FR-F01:** A focus task MUST have a non-empty title and an estimate between
  one and eight Pomodoros.
- **FR-F02:** A focus task MAY have a description.
- **FR-F03:** The user MUST be able to create, select, filter, edit, and delete
  focus tasks.
- **FR-F04:** An estimate MUST NOT be reduced below the number of sessions
  already completed for the task.
- **FR-F05:** A completed task MUST retain its recorded progress and MUST NOT be
  edited.
- **FR-F06:** Completing a Pomodoro with an eligible active task MUST increment
  that task once.
- **FR-F07:** Reaching the estimate MUST clear the task from active focus.
- **FR-F08:** Older incomplete tasks MUST be carried into the current local
  focus day.

### Persistence and statistics

- **FR-P01:** Anonymous task state MUST persist in browser storage and be scoped
  to the browser profile.
- **FR-P02:** Authenticated task and session state MUST persist in PostgreSQL and
  be scoped to the authenticated user.
- **FR-P03:** Timer preferences MUST persist in browser storage.
- **FR-P04:** Every authenticated Pomodoro completion MUST create a session
  record, whether or not a task is active.
- **FR-P05:** A task-associated session MUST preserve the task title at the time
  of completion for later reporting.
- **FR-P06:** Daily ownership and seven-day reporting MUST use the IANA time zone
  reported by the browser.
- **FR-P07:** The statistics page MUST require an authenticated session.

### Authentication and feedback

- **FR-A01:** The application MUST support Google OAuth.
- **FR-A02:** Authenticated reads and writes MUST be scoped to the current user.
- **FR-A03:** The application MUST communicate loading, success, and failure
  states for persisted task and Pomodoro operations.
- **FR-A04:** Timer completion SHOULD play the configured sound while the app is
  active or display a browser notification while it is inactive, according to
  browser capabilities and permission.

## 4. Behavioral Rules and Edge Conditions

- Pausing preserves elapsed progress; resetting returns the timer to its initial
  value and idle state.
- A duration change applies to an idle Pomodoro timer. An in-progress or paused
  session retains the duration with which it started.
- An anonymous daily store rolls forward only incomplete tasks when its saved
  local date differs from the current local date.
- An authenticated task query moves older incomplete tasks into the current
  `DailyFocusDay`; completed tasks remain associated with their completed day.
- Selecting a completed task is permitted for viewing its details, while editing
  is disabled.
- Deleting an active task also clears the active selection.
- Authenticated Pomodoro completion and task progress updates occur in one
  database transaction.
- A task associated with a different focus day is not advanced by the current
  day's completion.
- Invalid task identifiers, time zones, durations, or form values are rejected
  before their operation is applied.
- A notification depends on browser permission and browser notification/audio
  support; session completion itself does not depend on notification delivery.

## 5. Core Domain Terms

| Term                | Meaning                                                          |
| ------------------- | ---------------------------------------------------------------- |
| Pomodoro            | A configurable focus session completed by the timer              |
| Focus task          | A daily work item with an estimated and completed Pomodoro count |
| Active task         | The task currently associated with focus-session progress        |
| Daily focus day     | A user's focus data grouped by an ISO local calendar date        |
| Pomodoro session    | An authenticated record of one completed focus timer             |
| Task title snapshot | The task title stored on a session when it completes             |

## 6. Runtime Assumptions

- The browser provides a valid IANA time-zone identifier.
- Browser storage is available for anonymous task state and timer preferences.
- Browser notification permission is controlled by the user agent.
- Authenticated features have access to PostgreSQL and correctly configured
  OAuth providers.
