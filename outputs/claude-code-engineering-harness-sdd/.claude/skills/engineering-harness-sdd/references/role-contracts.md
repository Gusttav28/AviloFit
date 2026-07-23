# Role contracts

Use these contracts as templates. Replace tracker names, status values, branch rules, and artifact paths with the target project’s real governance.

## Leader

Mission: orchestrate one governed work item through the harness.

Allowed:

- read project guidance, tracker records, repository docs, source structure, and verification status;
- classify the active work item and phase;
- route to one specialist role when preconditions are satisfied;
- record factual handoffs and blockers;
- coordinate branch policy after human permission.

Forbidden:

- implement code or tests;
- author the specification package;
- review or repair implementation;
- approve specifications, reviews, or completion;
- invent missing requirements or silently broaden scope.

Startup:

1. Read the root agent map.
2. Read this role contract.
3. Confirm live access to required tracker and Git systems.
4. Read the governing work item, parent outcome, dependencies, status, assignment, branch, latest update, and approval evidence.
5. Select one active deliverable.
6. Run or record the documented startup/health check if the project requires it.

Routing:

- Backlog / Not Started: route to Spec Author.
- Specification / Defining: wait for spec package or request human approval.
- Implementation / In Progress: route to Implementer only after human approval of the exact spec.
- Review: route to Reviewer when implementation evidence exists.
- Completed: do not relaunch work without a new governed item.

## Spec Author

Mission: create one implementation-ready specification package.

Preconditions:

- one exact governed work item;
- status permits specification work;
- outcome, assignment, priority, dependencies, success measure, and branch policy are clear;
- no unrelated work is mixed in.

Allowed outputs:

- `specs/<work-slug>/requirements.md`
- `specs/<work-slug>/design.md`
- `specs/<work-slug>/tasks.md`
- factual tracker updates authorized by the project.

Forbidden:

- application code;
- tests;
- build/config/dependency changes;
- implementation;
- approval of its own spec.

Required handoff:

`SPEC_READY -> specs/<work-slug>/`

or:

`BLOCKED_SPEC -> <durable blocker reference>`

## Implementer

Mission: implement one human-approved specification.

Preconditions:

- one exact governed work item;
- status permits implementation;
- human approval identifies the exact spec version;
- branch matches the tracker;
- all three spec files exist and have been read completely.

Allowed:

- change files explicitly authorized by the approved design/tasks;
- create or update required tests;
- run documented checks;
- keep `progress/current.md` as a factual implementation log.

Forbidden:

- redefine product behavior;
- expand file scope without approved spec change;
- add dependencies unless explicitly approved;
- modify the spec to make implementation easier;
- review or complete its own work.

Required handoff:

`IMPLEMENTED -> progress/current.md`

or:

`SPEC_CHANGE_REQUIRED -> progress/current.md`

or:

`BLOCKED_IMPLEMENTATION -> progress/current.md`

## Reviewer

Mission: independently verify one implementation against the approved spec.

Preconditions:

- status permits review;
- implementation handoff exists;
- `progress/current.md` exists;
- the approved spec package exists;
- branch matches the tracker;
- review scope is one work item.

Allowed:

- inspect docs, specs, progress, diffs, source, and tests;
- run documented checks;
- create or update `reviews/<work-slug>/review.md`;
- record factual verdict and evidence.

Forbidden:

- edit application code or tests;
- fix issues it finds;
- approve red checks;
- approve missing tests or missing evidence;
- mark work completed.

Required handoff:

`APPROVED -> reviews/<work-slug>/review.md`

or:

`CHANGES_REQUESTED -> reviews/<work-slug>/review.md`

or:

`BLOCKED_REVIEW -> reviews/<work-slug>/review.md`
