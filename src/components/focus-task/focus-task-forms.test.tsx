import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { FocusTaskCreateForm } from "@/components/focus-task/focus-task-create-form";
import { FocusTaskUpdateForm } from "@/components/focus-task/focus-task-update-form";
import { AppProvider } from "@/lib/stores/daily-focus-tasks-store";
import type { FocusTask } from "@/lib/types/types";

const {
  createFocusTaskMock,
  deleteFocusTaskMock,
  toastErrorMock,
  toastSuccessMock,
  updateFocusTaskMock,
} = vi.hoisted(() => ({
  createFocusTaskMock: vi.fn(),
  deleteFocusTaskMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  updateFocusTaskMock: vi.fn(),
}));

vi.mock("@/lib/actions/focus-task-actions", () => ({
  createFocusTask: createFocusTaskMock,
  deleteFocusTask: deleteFocusTaskMock,
  updateFocusTask: updateFocusTaskMock,
}));

vi.mock("@/lib/hooks/auth-hooks", () => ({
  useAuthSession: () => ({
    isPending: false,
    isSignedIn: true,
    session: { user: { id: "user-1" } },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

const task: FocusTask = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: "Write integration tests",
  description: "Cover the focus task forms",
  estimatedPomodoros: 2,
  completedPomodoros: 1,
};

type Deferred = {
  promise: Promise<void>;
  reject: (error: Error) => void;
  resolve: () => void;
};

function createDeferred(): Deferred {
  let reject: Deferred["reject"] = () => undefined;
  let resolve: Deferred["resolve"] = () => undefined;
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    reject = rejectPromise;
    resolve = resolvePromise;
  });

  return { promise, reject, resolve };
}

function renderForm(form: ReactElement, tasks: FocusTask[] = []) {
  return render(
    <AppProvider
      initialValues={{
        activeTaskId: tasks[0]?.id,
        localDate: "2026-07-19",
        tasks,
      }}
    >
      {form}
    </AppProvider>,
  );
}

function getFormFields() {
  const fieldset = document.querySelector("fieldset");
  if (!(fieldset instanceof HTMLFieldSetElement)) {
    throw new Error("Expected the focus task form to contain a fieldset.");
  }

  return {
    description: screen.getByLabelText<HTMLInputElement | HTMLTextAreaElement>(
      "Description",
    ),
    estimatedPomodoros: screen.getByLabelText<HTMLInputElement>(
      "Estimated Pomodoros",
    ),
    fieldset,
    title: screen.getByLabelText<HTMLInputElement>("Title"),
  };
}

async function enterTaskValues({
  description,
  estimatedPomodoros,
  title,
}: ReturnType<typeof getFormFields>) {
  const user = userEvent.setup();

  await user.clear(title);
  await user.type(title, "Ship reliable forms");
  await user.clear(description);
  await user.type(description, "Keep input when requests fail");
  await user.clear(estimatedPomodoros);
  await user.type(estimatedPomodoros, "3");

  return user;
}

beforeEach(() => {
  createFocusTaskMock.mockReset();
  deleteFocusTaskMock.mockReset();
  toastErrorMock.mockReset();
  toastSuccessMock.mockReset();
  updateFocusTaskMock.mockReset();
});

describe("FocusTaskCreateForm", () => {
  test("resets the form and shows success after the task is created", async () => {
    const deferred = createDeferred();
    createFocusTaskMock.mockReturnValueOnce(deferred.promise);
    renderForm(<FocusTaskCreateForm />);
    const fields = getFormFields();
    const user = await enterTaskValues(fields);

    await user.click(screen.getByRole("button", { name: "Save task" }));

    expect(createFocusTaskMock).toHaveBeenCalledWith(
      {
        description: "Keep input when requests fail",
        estimatedPomodoros: 3,
        title: "Ship reliable forms",
      },
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    expect(fields.fieldset.disabled).toBe(true);
    expect(fields.title.value).toBe("Ship reliable forms");
    expect(toastSuccessMock).not.toHaveBeenCalled();

    await act(async () => deferred.resolve());

    await waitFor(() => expect(fields.title.value).toBe(""));
    expect(fields.description.value).toBe("");
    expect(fields.estimatedPomodoros.value).toBe("1");
    expect(fields.fieldset.disabled).toBe(false);
    expect(toastSuccessMock).toHaveBeenCalledWith("Focus task created.");
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  test("keeps the form values and shows an error when creation fails", async () => {
    const deferred = createDeferred();
    createFocusTaskMock.mockReturnValueOnce(deferred.promise);
    renderForm(<FocusTaskCreateForm />);
    const fields = getFormFields();
    const user = await enterTaskValues(fields);

    await user.click(screen.getByRole("button", { name: "Save task" }));
    await act(async () => deferred.reject(new Error("Creation failed")));

    await waitFor(() => expect(fields.fieldset.disabled).toBe(false));
    expect(fields.title.value).toBe("Ship reliable forms");
    expect(fields.description.value).toBe("Keep input when requests fail");
    expect(fields.estimatedPomodoros.value).toBe("3");
    expect(toastErrorMock).toHaveBeenCalledWith("Creation failed");
    expect(toastSuccessMock).not.toHaveBeenCalled();
  });
});

describe("FocusTaskUpdateForm", () => {
  test("ends editing and shows success after the task is updated", async () => {
    const deferred = createDeferred();
    const onEditingEnd = vi.fn();
    updateFocusTaskMock.mockReturnValueOnce(deferred.promise);
    renderForm(
      <FocusTaskUpdateForm task={task} onEditingEnd={onEditingEnd} />,
      [task],
    );
    const fields = getFormFields();
    const user = await enterTaskValues(fields);

    await user.click(screen.getByRole("button", { name: "Update task" }));

    expect(updateFocusTaskMock).toHaveBeenCalledWith(task.id, {
      description: "Keep input when requests fail",
      estimatedPomodoros: 3,
      title: "Ship reliable forms",
    });
    expect(fields.fieldset.disabled).toBe(true);
    expect(onEditingEnd).not.toHaveBeenCalled();
    expect(toastSuccessMock).not.toHaveBeenCalled();

    await act(async () => deferred.resolve());

    await waitFor(() => expect(onEditingEnd).toHaveBeenCalledOnce());
    expect(fields.fieldset.disabled).toBe(false);
    expect(toastSuccessMock).toHaveBeenCalledWith("Focus task updated.");
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  test("keeps editing and preserves values when the update fails", async () => {
    const deferred = createDeferred();
    const onEditingEnd = vi.fn();
    updateFocusTaskMock.mockReturnValueOnce(deferred.promise);
    renderForm(
      <FocusTaskUpdateForm task={task} onEditingEnd={onEditingEnd} />,
      [task],
    );
    const fields = getFormFields();
    const user = await enterTaskValues(fields);

    await user.click(screen.getByRole("button", { name: "Update task" }));
    await act(async () => deferred.reject(new Error("Update failed")));

    await waitFor(() => expect(fields.fieldset.disabled).toBe(false));
    expect(fields.title.value).toBe("Ship reliable forms");
    expect(fields.description.value).toBe("Keep input when requests fail");
    expect(fields.estimatedPomodoros.value).toBe("3");
    expect(onEditingEnd).not.toHaveBeenCalled();
    expect(toastErrorMock).toHaveBeenCalledWith("Update failed");
    expect(toastSuccessMock).not.toHaveBeenCalled();
  });
});
