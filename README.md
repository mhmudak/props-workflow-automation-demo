# PrOps Workflow Automation Demo

A modular workflow-automation engineering demonstration built with **React, Node.js, and Playwright**.

The project demonstrates how structured assessment content can be transformed into a platform-ready assessment through an automated authoring workflow.

> **PrOps — Workflow Automation Engineering by 3A**

---

## Overview

Many digital platforms still require users to repeatedly enter, configure, validate, and save structured information manually.

This project demonstrates an engineering approach that separates:

- structured input data;
- workflow logic;
- assessment-type logic;
- platform-specific interaction;
- browser automation;
- validation and verification.

The current implementation automates a multiple-choice assessment workflow against a neutral PrOps demonstration environment.

---

## Demo Workflow

```text
Structured Assessment Data
        ↓
Assessment Engine
        ↓
MCQ Handler
        ↓
Platform Adapter
        ↓
Playwright
        ↓
PrOps Demo Authoring Interface
        ↓
Save & Verification
```

The automated workflow currently handles:

- question text;
- four answer choices;
- correct-answer selection;
- hints;
- general feedback;
- difficulty;
- Depth of Knowledge;
- grade;
- keywords;
- learning outcome;
- save confirmation.

---

## Architecture

The automation layer uses a modular architecture designed to keep business logic separate from platform-specific implementation.

```text
automation/
│
├── data/
│   └── sample-question.json
│
├── scripts/
│   ├── run-demo.js
│   └── run-demo.baseline.js
│
└── src/
    ├── adapters/
    │   └── props-demo.adapter.js
    │
    ├── engine/
    │   └── assessment-engine.js
    │
    └── handlers/
        └── mcq.handler.js
```

### Assessment Engine

Routes each assessment to the appropriate component handler.

### Component Handler

Contains the business logic and validation rules for a specific assessment type.

The current implementation includes an MCQ handler.

### Platform Adapter

Contains platform-specific interaction logic.

This means the assessment workflow does not need to know how a particular platform is implemented.

The same architecture can later support additional adapters without rewriting the shared assessment logic.

---

## Why This Architecture?

The initial proof of concept used a single working automation script.

It was then refactored into separate responsibilities:

```text
Runner
  ↓
Assessment Engine
  ↓
Component Handler
  ↓
Platform Adapter
```

This separation makes the system easier to:

- maintain;
- test;
- extend;
- adapt to additional platforms;
- support additional assessment components.

The repository intentionally retains the original baseline runner temporarily so behavior can be compared during the architectural transition.

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Automation

- Node.js
- Playwright
- Google Chrome
- JSON structured data

### Development

- Git
- GitHub
- ESLint

---

## Project Structure

```text
props-workflow-automation-demo/
│
├── frontend/
│   └── React-based neutral assessment authoring environment
│
├── automation/
│   ├── data/
│   ├── scripts/
│   └── src/
│       ├── adapters/
│       ├── engine/
│       └── handlers/
│
├── .gitignore
└── README.md
```

---

## Running the Project

## Demo and Benchmark Modes

The automation supports two execution modes built on the same shared runtime.

### Demo Mode

````bash
cd automation
npm run demo

### Requirements

- Node.js
- npm
- Google Chrome

---

### 1. Start the Demo Platform

```bash
cd frontend
npm install
npm run dev
````

The application runs locally at:

```text
http://localhost:5173
```

---

### 2. Install Automation Dependencies

From another terminal:

```bash
cd automation
npm install
```

---

### 3. Run the Modular Automation

```bash
npm run demo
```

This executes:

```text
scripts/run-demo.js
```

using the modular engine, handler, and adapter architecture.

---

### 4. Run the Original Baseline

```bash
npm run demo:baseline
```

This executes the preserved pre-refactor implementation for comparison during development.

---

## Sample Input

The automation currently consumes structured JSON such as:

```json
{
  "type": "mcq",
  "questionText": "Which planet is closest to the Sun?",
  "answers": [
    {
      "label": "A",
      "text": "Venus",
      "correct": false
    },
    {
      "label": "B",
      "text": "Mercury",
      "correct": true
    }
  ],
  "metadata": {
    "difficulty": "Medium",
    "dok": "2",
    "grade": "4"
  },
  "learningOutcome": "SCI.4.2.1"
}
```

The production sample contains four answer choices.

---

## Current Status

### Implemented

- Neutral React assessment-authoring environment
- Structured JSON input
- MCQ automation
- Input validation
- Modular assessment engine
- MCQ-specific handler
- Platform adapter
- Playwright browser automation
- Save verification

### Planned

- Demo and benchmark execution modes
- Automated execution-time measurement
- Additional assessment components
- Interactive public demo
- Deployment
- Additional platform adapters
- API-based execution

---

## Design Principle

PrOps does not treat browser automation as the product.

The engineering objective is to automate complete operational workflows using the most appropriate technical method.

Depending on the target system, future implementations may use:

- APIs;
- browser automation;
- workflow orchestration;
- structured data pipelines;
- system integrations;
- validation engines.

---

## About PrOps

**PrOps** is a workflow automation engineering initiative by **3A**, based in Saida, Lebanon.

The project explores reusable engineering architectures for automating repetitive, high-volume digital operations.

---

## Disclaimer

This repository uses a purpose-built neutral demonstration environment and synthetic sample data.

It does not contain proprietary client interfaces, confidential production data, credentials, or private platform source code.
