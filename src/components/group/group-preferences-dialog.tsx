"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldDescription,
  Input,
  Checkbox,
} from "#/components/ui";
import { updateGroupPreferences } from "./actions";

export function GroupPreferencesDialog({
  classGroupId,
  initialIsVisible,
  initialColor,
  children,
}: {
  classGroupId: string;
  initialIsVisible: boolean;
  initialColor: string | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const [color, setColor] = useState<string>(initialColor ?? "#3b82f6");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await updateGroupPreferences({
      classGroupId,
      isVisible,
      color,
    });

    setIsSubmitting(false);

    if ("success" in result && result.success) {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group preferences</DialogTitle>
          <DialogDescription>
            Control how this group appears in your calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldLabel>
                <span>Visible</span>
              </FieldLabel>
              <FieldContent className="flex items-center gap-2">
                <Checkbox
                  checked={isVisible}
                  onCheckedChange={(checked) =>
                    setIsVisible(checked === true)
                  }
                />
                <FieldDescription>
                  When turned off, events from this group are hidden in your
                  calendar.
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="color">
                <span>Color</span>
              </FieldLabel>
              <FieldContent className="flex items-center gap-3">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="size-10 border-0 bg-transparent p-0"
                />
                <FieldDescription>
                  Used to color events from this group in your calendar.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

