"use client"

import { useState, ReactNode } from "react"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface WizardStep {
  id: string
  title: string
  description?: string
  content: ReactNode
  optional?: boolean
}

interface FormWizardProps {
  steps: WizardStep[]
  onComplete: () => void
  onCancel?: () => void
  className?: string
}

/**
 * FormWizard - Multi-step form component
 *
 * Usage:
 * const steps: WizardStep[] = [
 *   {
 *     id: "step1",
 *     title: "Basic Info",
 *     description: "Enter basic information",
 *     content: <Step1Form />
 *   },
 *   {
 *     id: "step2",
 *     title: "Details",
 *     content: <Step2Form />
 *   }
 * ]
 *
 * <FormWizard steps={steps} onComplete={handleComplete} />
 */
export function FormWizard({
  steps,
  onComplete,
  onCancel,
  className,
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleStepClick = (index: number) => {
    // Allow clicking on previous steps or completed steps
    if (index <= currentStep) {
      setCurrentStep(index)
    }
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          const isClickable = index <= currentStep

          return (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              {/* Step Circle */}
              <button
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  "relative flex flex-col items-center gap-2 group",
                  isClickable && "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground shadow-soft",
                    isActive &&
                      !isCompleted &&
                      "border-primary bg-background text-primary shadow-soft-md scale-110",
                    !isActive &&
                      !isCompleted &&
                      "border-muted bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="absolute top-12 text-center min-w-[120px]">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isActive && "text-foreground",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  )}
                  {step.optional && (
                    <span className="text-xs text-muted-foreground italic">
                      (Optional)
                    </span>
                  )}
                </div>
              </button>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-all",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="mt-16 min-h-[400px]">
        {steps[currentStep].content}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div>
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
          {isFirstStep && onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {steps[currentStep].optional && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleNext}
            >
              Skip
            </Button>
          )}
          <Button type="button" onClick={handleNext}>
            {isLastStep ? "Complete" : "Next"}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
