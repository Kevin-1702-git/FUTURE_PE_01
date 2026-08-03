"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10)
});

type ContactInput = z.infer<typeof contactSchema>;

export function ContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  async function onSubmit(values: ContactInput) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (!response.ok) {
      toast.error("Message could not be sent.");
      return;
    }

    toast.success("Message sent to Feast Lane.");
    form.reset();
  }

  return (
    <Card className="p-8">
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...form.register("name")} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register("phone")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" {...form.register("message")} />
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </Card>
  );
}
