# Variable Pay Performance Dashboard
## Design & Calculation Document

This document provides a comprehensive overview of the design structure, analytical views, and the underlying mathematical calculations used in the Variable Pay Performance Dashboard.

---

## 1. Dashboard Purpose & Design Structure
The dashboard is designed to provide actionable insights into employee performance for variable pay calibration. It allows HR Business Partners, Reward (C&B) teams, and Function Leaders to filter data, spot trends, identify inconsistencies in target setting, and drill down to individual employee trajectories over an 8-quarter period.

### 1.1 Global Filters & KPIs
At the top of the dashboard, users can filter the entire dataset by:
- **Function**
- **Designation**
- **Region**
- **Performance Band**

A **KPI Strip** dynamically updates based on the active filters, showing:
- Filtered Headcount vs Total
- Overall 8-Quarter Average Score
- FY 24-25 and FY 25-26 Averages with Year-over-Year (YoY) Movement
- Top and Lowest Performer
- Count of employees scoring below the 85% threshold and those in the "Critical" band.

### 1.2 Dashboard Views (Tabs)
1. **Overview:** Contains an organisation-wide quarterly trend line chart, a doughnut chart breaking down the headcount by performance band, and a Function × Quarter Heatmap to spot specific historical dips.
2. **Function / Department:** Groups employees by their business function. Displays a bar chart ranking functions by their average score against the organisation's average, alongside a detailed table showing headcount, spread (min/max/std dev), and trend.
3. **Designation / Level:** Similar to the Function view, but groups data by Employee Designation (role level).
4. **Employee Drill-down:** A deep dive into individual performance. Users can select an employee to see a dedicated line chart comparing their quarterly scores against their Function average and the overall Organisation average.
5. **Analytical Insights:** An auto-generated textual analysis engine that reads the filtered data and flags specific insights (e.g., functions with high variance, employees dropping in performance, and positive momentum candidates).

---

## 2. Core Calculations & Metrics

The dashboard calculates metrics dynamically based on the filtered data. Missing data (e.g., nulls, 0s, or negative data-entry errors) are excluded from the denominator to ensure fair representation of genuine performance.

### 2.1 Averages
- **Individual 8-Quarter Average (`avg`):** 
  The arithmetic mean of an employee's valid quarterly scores over the 8 quarters.
  *Formula:* `Sum of valid quarters / Number of valid quarters`
- **Group/Overall Average:**
  The average of the individual `avg` scores for all employees within the selected group (Function, Designation, or overall filtered population).

### 2.2 Performance Bands
Employees are grouped into 5 performance bands based on their 8-Quarter Average:
- **Outstanding:** ≥ 97%
- **Exceeds:** 92% to < 97%
- **Meets:** 85% to < 92%
- **Below:** 70% to < 85%
- **Critical:** < 70%

### 2.3 Trend (Positive/Downward Momentum)
The trend indicates whether an employee or group is improving or declining over the 8-quarter timeline.
- **Calculation:** The mean of the most recent 2 quarters minus the mean of the first 2 quarters.
  *Formula:* `Mean(Q7, Q8) - Mean(Q1, Q2)`
- **Interpretation:** 
  - `> +1.5 pts`: Upward Trend (▲)
  - `< -1.5 pts`: Downward Trend (▼)
  - Between `-1.5 and +1.5`: Flat/Stable (■)

### 2.4 Spread: Min, Max, and Standard Deviation
To identify whether a group's average is representative of the whole team or skewed by outliers, the dashboard calculates spread metrics:
- **Min / Max:** The absolute lowest and highest 8-quarter average scores within a specific group (e.g., Function).
- **Standard Deviation (`std`):** Measures the amount of variation or dispersion within a group.
  *Formula:* Population Standard Deviation = `√( Σ(x - μ)² / N )`
  *Interpretation:* A high standard deviation (e.g., > 10 points) in a single Function or Designation indicates inconsistent target setting or drastically uneven performance within the same role. It flags a need for manager-level target calibration.

### 2.5 Year-over-Year (YoY) Movement
Compares the financial year averages to see macro-level shifts.
- **FY 24-25 Average:** Mean of Q1 to Q4 valid scores.
- **FY 25-26 Average:** Mean of Q5 to Q8 valid scores.
- **YoY Movement:** `FY 25-26 Average - FY 24-25 Average`

---

## 3. Automated Analytical Insights Engine
The dashboard generates narrative insights dynamically based on the current data view:
1. **Function Benchmark:** Identifies the highest and lowest scoring functions and calculates the point spread between them.
2. **Consistency Risk:** Flags the function with the highest standard deviation as a risk for uneven target-setting.
3. **Immediate Attention:** Lists employees falling into the "Critical" band (<70%) who need immediate coaching or target review.
4. **Downward Trend:** Highlights employees who have dropped significantly (`Trend < -5 pts`) from their historical baseline.
5. **Positive Momentum:** Highlights employees who have improved significantly (`Trend > +8 pts`), recommending them as case studies for best practices.
6. **Headcount Concentration:** Warns the user if the filtered view is heavily skewed by a single large department, reminding them to check standard deviations rather than just averages.
