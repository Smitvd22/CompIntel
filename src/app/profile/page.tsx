"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, User } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Your account information.
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                {getInitials(session.user.name || session.user.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{session.user.name}</h2>
              <p className="text-muted-foreground">{session.user.email}</p>
              <Badge variant="secondary" className="mt-2">Free Plan</Badge>
            </div>
          </div>

          <Separator className="my-8 bg-border/50" />

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-muted p-2.5">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{session.user.name || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-muted p-2.5">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
