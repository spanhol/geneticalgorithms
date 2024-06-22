# Web-based Genetic Algorithm Pathfinding Simulation

Genetic algorithms (GAs) are powerful optimization techniques inspired by natural selection. They excel at finding solutions to complex problems where traditional methods struggle.

This project implements a GA simulation for pathfinding. Here, entities evolve to find the shortest path from the starting point to a target within a limited time.

The simulation uses a fitness function that considers both the distance to the target and the time taken by an entity to complete its path. Higher fitness scores indicate better paths.

## Description

Genetic algorithms are a powerful optimization technique inspired by the process of natural selection. They work by:

 - Maintaining a population of candidate solutions: Each solution, called an individual, represents a potential answer to the problem. Individuals are often encoded as chromosomes, similar to biological DNA strands.
 - Evaluating solutions using a fitness function: This function assigns a score to each individual based on how well it solves the problem. Higher scores indicate better solutions.
 - Evolving the population through selection, crossover, and mutation:
 - Selection: Individuals with higher fitness scores are more likely to be selected as parents for the next generation. This mimics how stronger organisms survive and reproduce in nature.
 - Crossover: Selected parents exchange genetic material (parts of their chromosomes) to create new offspring (children) that inherit traits from both parents. This allows for exploration of new solution combinations.
 - Mutation: Random changes are introduced into the offspring's chromosomes with a low probability. Mutation helps to maintain diversity in the population and prevent premature convergence to suboptimal solutions.
 - Iteratively improving the population: These steps are repeated over multiple generations, gradually improving the overall fitness of the population. The goal is to find the optimal or near-optimal solution for the given problem.

## Implementation Details
This web-based simulation is built using HTML, CSS, and JavaScript.

## How to run
1. Clone the repository
2. Open the index.html file on your browser
