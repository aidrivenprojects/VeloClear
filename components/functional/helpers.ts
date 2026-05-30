"use client";
export { getProject, getObjects, getRelations, getSignals, getLearning, getObjectsForTool, addObject, updateObjectStatus, type FunctionalProject, type FunctionalObject, type FunctionalSignal } from "@/lib/functionalStore";
export { projectPhases as projectPhasesFallback, getPhase, getTool } from "@/lib/projectOperatingModel";
