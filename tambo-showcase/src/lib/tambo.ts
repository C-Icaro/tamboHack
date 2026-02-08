/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * Tambo Playground showcase: Chart, SummaryCard, getSampleData tool.
 * InteractableNote registers automatically when mounted.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Chart, chartSchema } from "@/components/Chart";
import {
  InsightCard,
  insightCardSchema,
  InsightsList,
  insightsListSchema,
  NoteCard,
  noteCardSchema,
  NoteDetail,
  noteDetailSchema,
  NotesList,
  notesListSchema,
} from "@/components/digital-twin";
import { Graph, graphSchema } from "@/components/tambo/graph";
import { SummaryCard, summaryCardSchema } from "@/components/SummaryCard";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * getSampleData - Returns sample data for charts (sales by region, users, etc.)
 * Used when user asks for "sales by region" or similar data visualizations.
 */
async function getSampleData(params: {
  category?: "sales" | "users" | "revenue";
}) {
  const category = params.category ?? "sales";

  const datasets: Record<string, Array<{ name: string; value: number }>> = {
    sales: [
      { name: "North", value: 1200 },
      { name: "Northeast", value: 850 },
      { name: "Midwest", value: 450 },
      { name: "Southeast", value: 2100 },
      { name: "South", value: 980 },
    ],
    users: [
      { name: "Jan", value: 120 },
      { name: "Feb", value: 145 },
      { name: "Mar", value: 168 },
      { name: "Apr", value: 192 },
      { name: "May", value: 210 },
    ],
    revenue: [
      { name: "Q1", value: 45000 },
      { name: "Q2", value: 52000 },
      { name: "Q3", value: 48000 },
      { name: "Q4", value: 61000 },
    ],
  };

  return datasets[category] ?? datasets.sales;
}

/** Digital Twin tools - fetch from API routes */
async function getDigitalTwinNotes(params: {
  category?: "sentimento" | "estudo" | "all";
  search?: string;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.search) sp.set("search", params.search);
  if (params.limit) sp.set("limit", String(params.limit));
  const res = await fetch(`/api/notes?${sp}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getDigitalTwinNoteDetail(params: { noteId: number }) {
  const res = await fetch(`/api/notes/${params.noteId}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getDigitalTwinInsights(params: {
  type?: string;
  noteId?: number;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params.type) sp.set("type", params.type);
  if (params.noteId) sp.set("note_id", String(params.noteId));
  if (params.limit) sp.set("limit", String(params.limit));
  const res = await fetch(`/api/insights?${sp}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function getDigitalTwinStats() {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const tools: TamboTool[] = [
  {
    name: "getDigitalTwinNotes",
    description:
      "Fetches notes from the Digital Twin (personal notes database from Obsidian). Filters by category (sentiment, study, all) or search term. Use when user asks for sentiment notes, study notes, or to search by term.",
    tool: getDigitalTwinNotes,
    inputSchema: z.object({
      category: z
        .enum(["sentimento", "estudo", "all"])
        .optional()
        .describe("Category: sentiment (personal/emotional notes), study (study/professional notes), all (all)"),
      search: z.string().optional().describe("Search term in title or content"),
      limit: z.number().optional().describe("Max notes to return (default 50)"),
    }),
    outputSchema: z.array(
      z.object({
        id: z.number(),
        title: z.string().nullable(),
        content: z.string(),
        body_content: z.string().nullable(),
        tags: z.string().nullable(),
        folder_path: z.string().nullable(),
        processed_at: z.string().nullable(),
      })
    ),
  },
  {
    name: "getDigitalTwinNoteDetail",
    description:
      "Gets full detail of a Digital Twin note by ID, including all AI-generated insights.",
    tool: getDigitalTwinNoteDetail,
    inputSchema: z.object({
      noteId: z.number().describe("Note ID"),
    }),
    outputSchema: z.object({
      id: z.number(),
      title: z.string().nullable(),
      content: z.string(),
      body_content: z.string().nullable(),
      tags: z.string().nullable(),
      folder_path: z.string().nullable(),
      insights: z.array(
        z.object({
          id: z.number(),
          insight_type: z.string(),
          insight_text: z.string(),
        })
      ),
    }),
  },
  {
    name: "getDigitalTwinInsights",
    description:
      "Lists insights from the Digital Twin. Can filter by type (insight, goals, habits, reflections) or by note.",
    tool: getDigitalTwinInsights,
    inputSchema: z.object({
      type: z.string().optional().describe("Insight type"),
      noteId: z.number().optional().describe("Note ID to filter by"),
      limit: z.number().optional().describe("Max insights (default 50)"),
    }),
    outputSchema: z.array(
      z.object({
        id: z.number(),
        note_id: z.number(),
        insight_type: z.string(),
        insight_text: z.string(),
        note_title: z.string().optional(),
      })
    ),
  },
  {
    name: "getDigitalTwinStats",
    description:
      "Digital Twin stats: total notes, total insights, count by category (sentiment, study).",
    tool: getDigitalTwinStats,
    inputSchema: z.object({}),
    outputSchema: z.object({
      totalNotes: z.number(),
      totalInsights: z.number(),
      byCategory: z.object({
        sentimento: z.number(),
        estudo: z.number(),
      }),
    }),
  },
  {
    name: "getSampleData",
    description:
      "Get sample data for charts. Returns data with name and value for each item. Use when user asks for sales by region, user growth, revenue, or similar data visualizations.",
    tool: getSampleData,
    inputSchema: z.object({
      category: z
        .enum(["sales", "users", "revenue"])
        .optional()
        .describe("Data category: sales (by region), users (by month), revenue (by quarter)"),
    }),
    outputSchema: z.array(
      z.object({
        name: z.string(),
        value: z.number(),
      })
    ),
  },
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
];

export const components: TamboComponent[] = [
  {
    name: "NotesList",
    description:
      "List of Digital Twin notes. Receives array of {title, excerpt, tags, folderPath, noteId}. Use after getDigitalTwinNotes. excerpt = first 150 chars of content. tags = array of strings.",
    component: NotesList,
    propsSchema: notesListSchema,
  },
  {
    name: "NoteDetail",
    description:
      "Full detail of a Digital Twin note with insights. Use after getDigitalTwinNoteDetail. note: {id, title, content, folderPath, tags}. insights: [{type, text}].",
    component: NoteDetail,
    propsSchema: noteDetailSchema,
  },
  {
    name: "InsightsList",
    description:
      "List of Digital Twin insights. Receives array of {type, text, noteTitle}. Use after getDigitalTwinInsights.",
    component: InsightsList,
    propsSchema: insightsListSchema,
  },
  {
    name: "NoteCard",
    description:
      "Individual note card. Use to display a highlighted note.",
    component: NoteCard,
    propsSchema: noteCardSchema,
  },
  {
    name: "InsightCard",
    description:
      "Individual insight card. Use to display a highlighted insight.",
    component: InsightCard,
    propsSchema: insightCardSchema,
  },
  {
    name: "Chart",
    description:
      "Displays data as chart (bar, line or pie). Use with arrays of {name, value}. Ideal for sales by region, simple metrics.",
    component: Chart,
    propsSchema: chartSchema,
  },
  {
    name: "SummaryCard",
    description:
      "Displays a summary card with title, content and optional highlight. Use for summarized lists, key points, conclusions.",
    component: SummaryCard,
    propsSchema: summaryCardSchema,
  },
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports multiple datasets and advanced styling.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
];
