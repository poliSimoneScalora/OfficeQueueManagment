TEMPLATE FOR RETROSPECTIVE (Team 10)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done `3/3`
- Total points committed vs. done `9/9`
- Nr of hours planned vs. spent (as a team) `115h/112h 5m`

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed


### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |20       |        |55h30m   |56h45m       |
| _#1_   |10       |3       |22h30m     |22h4m        |
| _#2_   |7        |5       |18h        |16h30m       |
| _#3_   |9        |1       |19h        |16h45m       |



- Hours per task average, standard deviation (estimate and actual)
  - estimate: `average: 2 hours 30 minutes` `standard deviation: 16 minutes`
  - actual: `average: 2 hours 26 minutes` `standard deviation: 23 minutes`
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1 = −0.0254 $$
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| =0.0607 $$
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: `25h`
  - Total hours spent: `21h30m`
  - Nr of automated unit test cases `23 test cases into 4 test suits`
  - Coverage (if available) `only available for server tests: | 66.43% stmts | 33.62% branch | 64.64% funcs | 68.72% lines`
- E2E testing:
  - Total hours estimated
  - Total hours spent
  `not assigned as tasks but some e2e testing has been done while coding for testing main functionalities`
- Code review 
  - Total hours estimated `15h30m`
  - Total hours spent `15h30m`
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
  - `The majority are small estimation errors. The main problems are about not understanding well the complexity of a task. In the majority of our errors the estimations where too high in time.` 
  - `Also in the task point decision making some mistakes are made, in fact the majority of the effort has been taken by general tasks to setup the project like `

- What lessons did you learn (both positive and negative) in this sprint? 
  - `The main lesson learned in this sprint is to be organized from the start is a great help for handling the work during the sprint. `

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > - Improving team coordination between back-end team and front-end team.
  > - Being better organized from the start so that the working schedule can be spread better during the sprint

- One thing you are proud of as a Team!!
  > - In the end we manage to produce all the work we have scheduled and all of us are satisfied about how the demo works.