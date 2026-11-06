import type { GoalDto, GoalStatus } from "@mentalidade/shared";
import type { GoalWithMilestones } from "../repositories/goalRepository";

// Converte o registro do banco para o formato de transporte de uma meta.
export function toGoalDto(goal: GoalWithMilestones): GoalDto {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate ? goal.targetDate.toISOString() : null,
    status: goal.status as GoalStatus,
    progress: goal.progress,
    milestones: goal.milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      done: milestone.done,
      order: milestone.order,
    })),
  };
}
