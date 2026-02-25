import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShapeType } from "../draw";

export interface Shape {
    type: ShapeType;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
}

interface CanvasState {
    shapes: Shape[];
    history: Shape[][];
    historyStep: number;

    // Actions
    addShape: (shape: Shape) => void;
    setShapes: (shapes: Shape[]) => void;
    undo: () => void;
    redo: () => void;
    clear: () => void;
}

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            shapes: [],
            history: [[]],
            historyStep: 0,

            addShape: (shape: Shape) => {
                const { shapes, history, historyStep } = get();
                const newShapes = [...shapes, shape];

                const newHistory = history.slice(0, historyStep + 1);
                newHistory.push(newShapes);

                set({
                    shapes: newShapes,
                    history: newHistory,
                    historyStep: newHistory.length - 1
                });
            },

            setShapes: (shapes: Shape[]) => {
                set({
                    shapes,
                    history: [shapes],
                    historyStep: 0
                });
            },

            undo: () => {
                const { history, historyStep } = get();
                if (historyStep > 0) {
                    const newStep = historyStep - 1;
                    set({
                        shapes: history[newStep],
                        historyStep: newStep
                    });
                }
            },

            redo: () => {
                const { history, historyStep } = get();
                if (historyStep < history.length - 1) {
                    const newStep = historyStep + 1;
                    set({
                        shapes: history[newStep],
                        historyStep: newStep
                    });
                }
            },

            clear: () => {
                set({
                    shapes: [],
                    history: [[]],
                    historyStep: 0
                });
            }
        }),
        {
            name: "canvas-draw-it", 
        }
    )
);
