"use client"

import type React from "react"
import Link from "next/link"
import { Database, Key, Activity, Settings, BarChart3, Users, Zap, Clock, TrendingUp, Shield, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DashboardOverviewProps {
  user: any
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <h2 className="mb-2 text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h2>
        <p className="text-muted-foreground">Here's an overview of your Tensorus account and recent activity.</p>
      </section>

      {/* Quick stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Key} label="API Keys" value="3" />
        <StatCard icon={Activity} label="API Calls" value="1,247" iconClass="text-green-600" />
        <StatCard icon={Database} label="Tensors" value="18" iconClass="text-blue-600" />
        <StatCard icon={TrendingUp} label="Usage" value="76%" iconClass="text-orange-600" />
      </div>

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AccountOverview user={user} />
        <UsageStats />
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconClass = "",
}: {
  icon: typeof Database
  label: string
  value: string
  iconClass?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center space-x-2 p-6">
        <Icon className={`h-5 w-5 ${iconClass}`} />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AccountOverview({ user }: { user: any }) {
  const Row = ({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm">{children}</span>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Overview
        </CardTitle>
        <CardDescription>Your account details and subscription status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Row label="Plan">
          <Badge variant={user.plan === "enterprise" ? "default" : user.plan === "pro" ? "secondary" : "outline"}>
            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
          </Badge>
        </Row>

        <Row label="Email Status">
          <Badge variant="default">
            Verified
          </Badge>
        </Row>

        <Row label="2FA">
          <Badge variant="outline">
            Disabled
          </Badge>
        </Row>

        <Row label="Member Since">{new Date(user.created_at).toLocaleDateString()}</Row>

        <Button variant="outline" className="w-full bg-transparent">
          <Settings className="mr-2 h-4 w-4" />
          Account Settings
        </Button>
      </CardContent>
    </Card>
  )
}

function UsageStats() {
  const UsageRow = ({
    label,
    percent,
    used,
    total,
  }: {
    label: string
    percent: number
    used: string
    total: string
  }) => (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">
          {used} / {total}
        </span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage Statistics
        </CardTitle>
        <CardDescription>Your API usage for the current month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UsageRow label="API Calls" percent={12.47} used="1,247" total="10,000" />
        <UsageRow label="Data Processing" percent={6.4} used="3.2 GB" total="50 GB" />
        <UsageRow label="AI Agent Calls" percent={9.12} used="456" total="5,000" />

        <div className="border-t pt-4">
          <p className="mb-3 text-sm text-muted-foreground">
            You're on the <strong>Pro</strong> plan. Upgrade for higher limits.
          </p>
          <Button variant="outline" className="w-full bg-transparent">
            <Zap className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActions() {
  const QuickLink = ({
    href,
    icon: Icon,
    text,
  }: {
    href: string
    icon: typeof Database
    text: string
  }) => (
    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
      <Link href={href}>
        <Icon className="mr-2 h-4 w-4" />
        {text}
      </Link>
    </Button>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <QuickLink href="/developer/keys" icon={Key} text="Manage API Keys" />
        <QuickLink href="/demo" icon={Database} text="Try Demo" />
        <QuickLink href="/guide" icon={Users} text="View Documentation" />

        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </CardContent>
    </Card>
  )
}

function RecentActivity() {
  const Item = ({
    color,
    title,
    time,
  }: {
    color: string
    title: string
    time: string
  }) => (
    <div className="flex items-center space-x-3">
      <div className={`h-2 w-2 rounded-full bg-${color}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest API calls and operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Item color="green-500" title="Tensor analysis completed" time="2 min ago" />
        <Item color="blue-500" title="API key generated" time="1 h ago" />
        <Item color="orange-500" title="Data upload processed" time="3 h ago" />
        <Item color="purple-500" title="Profile updated" time="1 day ago" />
      </CardContent>
    </Card>
  )
}