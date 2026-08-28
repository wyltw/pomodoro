# Pomodoro Architecture Decisions

These compact decision records use Context, Decision, and Consequences to keep
the reason for each choice separate from its implementation history.

## ADR-001: Share task UI state across persistence modes

**Context.** Anonymous tasks come from local storage, while signed-in tasks come
from the database. `FocusTaskSidebar` and `TimerTabs` consume the same Zustand
store from separate branches, so their Provider cannot move below either branch.
The original `initialValues` path for server-fetched state was therefore not
completed; the shared Provider remains in `src/app/(app)/layout.tsx` and uses the
client session.

**Decision.** Use persist middleware only without a `userId`. For a signed-in
user, fetch with TanStack Query and copy the result into the same Zustand state
interface. Key the Zustand and Query providers by `userId`.

**Consequences.** The task UI does not need separate anonymous and signed-in
implementations. Changing users recreates both state and cache, while anonymous
tasks remain separate and are not merged into an account.

**History.** `75ead86` persisted store → `44f8b04` Provider and `initialValues` →
`3dc2564` client query → `63e5d2b` persistence from session → `a876c0b`
user-keyed providers.

## ADR-002: Keep task orchestration outside Timer

**Context.** Timer only needs to manage countdown state and controls. It does not
need to know which task is active, whether the user is signed in, or where task
progress and completed sessions are stored. Those concerns still need to react
to Timer completion, and both `TimerTabs` and `FocusTaskSidebar` need access to
the task store. This is why the task Provider described in ADR-001 must remain
above those two branches.

**Decision.** Keep countdown state local to each `TimerContextProvider` and have
Timer report only its completed duration through `onComplete`. Use `TimerTabs`
as the orchestration layer between Timer and task behavior: it reads the active
task and authentication state, chooses the anonymous or signed-in completion
path, runs the task/session mutation, and invalidates the affected queries. The
Timer data and API contexts remain split, while `TimerStatusProvider` exposes
only the status needed to prevent task changes during a running session.

**Consequences.** Timer remains a small local API without task, authentication,
or persistence dependencies. Task integration stays in `TimerTabs`, which must
remain inside the high client boundary shared with `FocusTaskSidebar`. Splitting
data from API also prevents seconds updates from re-rendering API-only consumers.

**History.** `08c9341` local hook → `dd159c8` data/API contexts → `9bc484c`
Timer completion updates the active task → `4a0b72d` reducer → `4c0700b`
signed-in completion persistence → `da1508e` completed session records.

## ADR-003: Reset completed Timer state by unmounting it

**Context.** Before a separate completed tab existed, the completion view was
rendered inside the same `TimerContextProvider`. "Keep focusing" selected the
already-active `pomodoro` value, so the Timer did not unmount and retained its
completed state.

**Decision.** Move every completed session to a dedicated `completed` tab. The
completion view then changes the selected tab to the next Pomodoro or break.

**Consequences.** Entering the `completed` tab unmounts the finished Timer.
Choosing the next Pomodoro or break then mounts a new Timer with idle state,
without adding reset coordination to the Timer itself.

**History.** `b421611` separate completed view → `3bcba29` completed tab reset.

## ADR-004: Create and roll forward focus days on the server

**Context.** Authenticated tasks and sessions require a `DailyFocusDay`. The
first implementation created it from a client effect, adding a separate request
that had to run at the correct time. Carrying unfinished tasks into the current
day also requires a write when the task list is loaded.

**Decision.** Let the browser provide its IANA time zone, then validate it and
derive `localDate` on the server. Each operation gets or creates the required day
itself. Task creation and Pomodoro completion do this inside their transactions;
task-list loading also reassigns older unfinished tasks to today's day.

**Consequences.** The client has no day-initialization sequence. Task-list GET is
intentionally not read-only, and carry-forward happens lazily when the list is
requested rather than through a scheduled rollover job.

**History.** `216fefa` client initialization → `ff8ab37` removed its refetch →
`eccc214` task and day transaction → `8602de4` server-derived date → `6579383`
server services → `184fcc0` lazy carry-forward.

## ADR-005: Store each completed Pomodoro as a PomodoroSession

**Context.** Carry-forward changes a task's `dailyFocusDayId`, and tasks can be
renamed or deleted. Session history must retain when work occurred and the task
label shown at that time without storing every task revision. The original daily
count and task completion timestamp duplicated values available elsewhere.

**Decision.** Treat `FocusTask.dailyFocusDayId` as the task's current daily
assignment, while immutable `PomodoroSession.dailyFocusDayId` records the
session's date. Store an optional `focusTaskId` and a `taskTitleSnapshot` on each
session. Derive daily counts from session rows and task completion from
`completedPomodoros >= estimatedPomodoros`.

**Consequences.** Carry-forward does not preserve a task's creation date.
Statistics remain stable across task rename or deletion and group by the title
snapshot. `focusTaskId` is not needed by current statistics but remains available
for future task-specific session features. Pomodoro completion updates eligible
task progress and creates the session in the same transaction.

**History.** `226dce9` day and task schema → `4c0700b` completion counters →
`eeca7d1` session model → `da1508e` title snapshot and session writes → `184fcc0`
mutable task-day assignment → `dbc7c11` removed `DailyFocusDay.completedPomodoros`
and `FocusTask.completedAt`.

## ADR-006: Keep authenticated query data immediately stale

**Context.** Focus tasks, today's Pomodoro count, and focus statistics are small
authenticated server-state queries. Mutations performed by the current client
invalidate the known affected query keys, so those updates do not need a timed
freshness window. The same data can still change outside that path: another tab
or device may update it, and the meaning of "today" changes at the user's local
date boundary. Focus statistics also change when a Pomodoro session is created.

**Decision.** Keep TanStack Query's default `staleTime` of `0`. Continue to
invalidate affected queries immediately after local mutations, while allowing
stale queries to refetch on normal triggers such as remounting or window focus.
Do not treat these user-owned records as permanently fresh.

**Consequences.** The application may make repeated background requests when a
query remounts or the window regains focus, but the payloads are small and the
extra requests reduce the chance of displaying cross-day or externally changed
data. Cached data remains available while a stale query refetches. Before using
a long or infinite `staleTime`, the application must explicitly handle local
date rollover and external updates; focus-statistics invalidation must also be
added to the Pomodoro-completion path.
