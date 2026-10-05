import { PdfPageContent } from '../types/content';

export const DSA_SEARCHING_SORTING_PAGES: PdfPageContent[] = [
  {
    pageNumber: 1,
    title: 'Unit I: Data Structures & Algorithms — Searching and Sorting',
    content: `Unit I: Data Structures & Algorithms — Searching and Sorting

Introduction of Data Structures:
• Data: Data is the collection of facts and figures, or data is value or group of values which is in a particular format.
• Information: Information can be defined as a structured or classified data which delivers some meaningful things to the recipient.
• Knowledge: Knowledge can be defined as knowing the things before those can be experienced.
• Data Structures: Data structure is a way of collecting as well as organizing data in such a way that various operations can be performed on it in an effective way.
• A data structure is a logical model of a particular organization of data.`,
    keyPoints: [
      'Data = Raw facts & values in particular format',
      'Information = Processed & structured data with meaning',
      'Knowledge = Understanding prior to experiential execution',
      'Data Structure = Logical organization for optimal operations',
    ],
    diagramText: `[ Raw Data ] ──(Organize & Structure)──> [ Information ] ──(Insights)──> [ Knowledge ]`,
  },
  {
    pageNumber: 2,
    title: 'Data Structures Need & Classification',
    content: `Data structures are structures which are programmed to store sequential data, so that it will be easy to perform various operations on it.

Data objects:
It is a region of storage that contains a value or group of values.

Need of Data Structure:
1. Stores huge data.
2. Stores data in systematic way.
3. Retains logical relationship.
4. Provides various structures (stack, queue).
5. Static & Dynamic formats to store data.
6. Better algorithms (improve efficiency).

Data Structure Classification:
               Data Structures
             /                 \\
     Primitive DS             Non-Primitive DS
     (int, float,             /              \\
      char, ptr)          Linear            Non-Linear
                        /       \\           /        \\
                    Array    List,Files   Stacks,    Graph,
                                          Queues     Trees`,
    keyPoints: [
      'Primitive DS: int, float, char, pointer',
      'Non-Primitive Linear: Array, Linked List, Stack, Queue, Files',
      'Non-Primitive Non-Linear: Tree, Graph',
    ],
  },
  {
    pageNumber: 3,
    title: 'Primitive vs Non-Primitive & Linear Data Structures',
    content: `1. Primitive Data Structure:
Primitive Data structures are the basic data structures that directly operate upon the machine instructions. They have different representations on different computers.
eg: Floating point numbers, character constants, string constants & pointers.

2. Non-Primitive Data Structures:
Non-primitive data structures are more complicated data structures and are derived from primitive data structures.
eg: Arrays, List, Files.

Linear Data Structures:
The data structure where data items are organized sequentially or linearly one after another is called linear data structure.
• Every item is related to its previous and next item.
• Data is arranged in linear sequence.
• Implementation is Easy.
• Eg: Array, Stack, Queue, Linked List.`,
    keyPoints: [
      'Linear = Sequential ordering where elements have direct predecessors and successors',
      'Memory mapping is contiguous or pointer-linked',
    ],
  },
  {
    pageNumber: 4,
    title: 'Stack, Queue & Non-Linear Data Structures',
    content: `a) Stack:
Stack is a data structure in which addition & deletion of element is allowed at the same end as TOP of the stack.
A stack is LIFO (Last In First Out) DS.

b) Queue:
A Queue is a data structure in which addition of element is allowed at one end called REAR & deletion is allowed at another end called FRONT.
A Queue is FIFO (First In First Out) DS.

Non-Linear Data Structures:
A data structure in which the data items are not organized sequentially or in linear fashion is called as Non-linear data structure.
• Every item is attached with many other items.
• Data is arranged in non-linear sequence.
• Data items cannot be traversed in a single run.
• Implementation is difficult.
• Eg: Tree, Graph`,
    keyPoints: [
      'Stack: LIFO (Push/Pop at TOP)',
      'Queue: FIFO (Enqueue at REAR, Dequeue at FRONT)',
      'Non-linear: Hierarchical/network relationships requiring multi-branch traversal',
    ],
  },
  {
    pageNumber: 5,
    title: 'Tree, Graph & Static Data Structures',
    content: `a) Tree:
Tree is collection of nodes where the nodes are arranged hierarchically & form a parent-child relationship.

b) Graph:
It is a collection of a finite number of vertices & edges which connect these vertices.

Static Data Structures:
In static data structures the size of the structure is fixed.
eg: Array
int a[5] = {1, 2, 3, 4, 5}
Array indices:  [0]  [1]  [2]  [3]  [4]
Elements:        1    2    3    4    5
Length: 5 | Starting index: 0 | Ending index: 4

Advantage:
• Faster access of elements via index O(1).

Disadvantage:
• Fixed size.
• Add, remove or modify element is not directly possible (requires shifting).
• Resources are allocated at the time of creation of data structures.`,
    keyPoints: [
      'Tree: Hierarchical parent-child topology',
      'Graph: Network of V vertices and E edges',
      'Static DS: Pre-allocated compile/initialization time bounds',
    ],
  },
  {
    pageNumber: 6,
    title: 'Dynamic & Persistent Data Structures',
    content: `Dynamic Data Structures:
They are designed to facilitate change of data structures at runtime.
It is possible to change the assigned values of elements dynamically.
eg: Linked List:
Head -> [ A | * ] -> [ B | * ] -> [ C | NULL ]

Advantages:
• Efficiently add, remove or modify elements.
• Flexible size (expands on demand).
• Effective use of resources as they are allocated at runtime, as per requirement.

Disadvantage:
• Slower access to elements (O(n) sequential traversal).

Persistent Data Structures:
Persistent data structure is a data structure that always preserves the previous version of itself when it is modified.
They are immutable as their operation do not update the structure in-place, but always yield a new updated structure.`,
    keyPoints: [
      'Dynamic DS: Runtime heap allocation with pointer chasing',
      'Persistent DS: Version history preservation without destructive updates',
    ],
  },
  {
    pageNumber: 7,
    title: 'Persistence Types & Ephemeral Structures',
    content: `Partially Persistent:
If all versions can be accessed but only the newest version can be modified.

Fully Persistent:
If every version can be both accessed & modified.

Confluently Persistent:
It merges and creates a new version from two previous versions.

Ephemeral Data Structures:
It is one for which only one version is available at a time.
It is a data structure in which we cannot retain its previous state.
eg: RAM, Cache memory.`,
    keyPoints: [
      'Partially Persistent: Read all versions, write newest only',
      'Fully Persistent: Read/Write any historical branch',
      'Confluent: Fork & merge branch capabilities',
      'Ephemeral: Single mutable state with history loss',
    ],
  },
  {
    pageNumber: 8,
    title: 'Complexity of Algorithms: Time & Space',
    content: `Complexity of Algorithms:
Complexity in algorithms refers to the amount of resources (such as time or memory) required to solve a problem or perform a task.
The complexity of an algorithm is a function describing the efficiency of the algorithm in terms of the amount of data the algorithm must process.

Types of Complexity:
1. Space Complexity:
The amount of computer memory required to solve the given problem of particular size is called as Space complexity.

Space(S) = Fixed Part + Variable Part

• Fixed Part:
Required for instruction space i.e. constants, variable, byte code, etc. It is not dependent on characteristics of inputs & outputs.

• Variable Part:
Instance of input & output data. It consists of space necessary for variables, size of specific problem instance being solved.`,
    keyPoints: [
      'Complexity evaluates algorithmic resource scaling',
      'Space = Fixed (instruction/constants) + Variable (instance arrays/recursion stack)',
    ],
  },
  {
    pageNumber: 9,
    title: 'Space Complexity Derivation & Time Intro',
    content: `Examples of Space Complexity Calculation:

eg 1:
sum(a, b):
    return a + b
Here two variables (a & b) are necessary to store values.
Space Complexity S = 2 (Fixed Part -> O(1))

eg 2:
sum(a[], n):
    sum = 0
    for i in range(0, n):
        sum = sum + a[i]
    return sum;

Space complexity Calculation:
- One computer word to store n
- n space to store array a[]
- One space for variable sum & one for i
Total Space S(n) = 1 + n + 1 + 1 = n + 3 => O(n)

2. Time Complexity:
The time which is required for analysis of given problem of particular size is known as Time complexity.
• Fixed Part: Compile time
• Variable Part: Run time which depends upon problem instance.`,
    keyPoints: [
      'Scalar arithmetic functions: S(n) = O(1)',
      'Vector/Array aggregations: S(n) = n + 3 = O(n)',
    ],
  },
  {
    pageNumber: 10,
    title: 'Methods of Measuring Time Complexity',
    content: `Methods of Measuring Time Complexity:

1. Stop Watch:
Use stop watch to get time in seconds or milliseconds (machine-dependent benchmark).

2. Step Count:
The step count method is one of the method to analyze the time complexity of an algorithm.
Here we count the number of times each instruction is executed.
It is also known as Frequency Count Method.

Step Count for different statements:
1. Comments:
Not executed during execution. Number of times comment executes = 0.

2. Conditional Statements:
- It will be executed if the condition is true. So it will be executed one time.
- if-else will be executed 0 or 1 time.
- switch case statement will be executed one time but inner case statement will execute if none of the previous case statements are executed.
- nested if-else is executed at least once.`,
    keyPoints: [
      'Empirical stopwatch approach varies by CPU hardware',
      'Theoretical step count / frequency method gives machine-independent bounds',
    ],
  },
  {
    pageNumber: 11,
    title: 'Step Count & Linear Search Algorithm',
    content: `3. Loop statements:
Loop statements are iterative statements. They are executed one or more times based on given condition.

4. Functions:
Executed based on the number of times they get called.

Example: Linear Search Algorithm Step Count
LinearSearch(arr, n, key)
{
    i = 0;                  // 1 execution -> O(1)
    for (i = 0; i < n; i++) // (n + 1) checks -> O(n+1)
    {
        if (arr[i] == key)  // n comparisons -> O(n)
        {
            print("Found"); // 0 or 1 execution -> O(1)
        }
    }
}

Total no. of execution time: (n + 4)
Time Complexity = O(n)

As we ignore lower exponents and constants in time complexity analysis.`,
    keyPoints: [
      'Loop header executes n+1 times for n iterations',
      'Linear search step count evaluates to n + 4 => O(n)',
    ],
  },
  {
    pageNumber: 12,
    title: 'Asymptotic Notations: Theta Notation (Θ)',
    content: `Asymptotic Notations:
Asymptotic Notations are the mathematical tools used to analyze the performance of algorithms by understanding how their efficiency changes as the input size grows.

There are three asymptotic notations:
1. Big-O Notation (O)
2. Omega Notation (Ω)
3. Theta Notation (Θ)

1. Theta Notation (Θ):
Theta notation encloses the function from above & below. Since it represents the upper & lower bound of the running time of an algorithm.
It represents the average case time complexity.

Graph:
Time ^              / c2 * g(n)
     |             /-- f(n)
     |            /--- c1 * g(n)
     +───────────*─────────────> n
                n0

Θ(g(n)) = { f(n) : there exist positive constants c1, c2 & n0 such that:
0 <= c1*g(n) <= f(n) <= c2*g(n) for all n >= n0 }`,
    keyPoints: [
      'Theta (Θ) gives asymptotically tight bound',
      'Sandwiches f(n) between c1*g(n) and c2*g(n)',
    ],
  },
  {
    pageNumber: 13,
    title: 'Omega (Ω) & Big-O (O) Notations',
    content: `2. Omega Notation (Ω):
Omega notation is used to define the lower bound of an algorithm in terms of time complexity.
• It always indicates the minimum time required by an algorithm for all i/p values.
• It describes the best case of algorithm time complexity.

Consider function f(n) the time complexity of an algorithm & g(n) is the most significant term.
If f(n) >= c * g(n) for all n >= n0, c > 0 & n0 >= 1
Then we can represent f(n) as Ω(g(n)):
f(n) = Ω(g(n))

3. Big-O Notation (O):
Big-O notation represents the upper bound of the running time of an algorithm.
• It gives the worst case time complexity.
• It is most widely used asymptotic notation.`,
    keyPoints: [
      'Omega (Ω) = Asymptotic Lower Bound (Best Case)',
      'Big-O (O) = Asymptotic Upper Bound (Worst Case)',
    ],
  },
  {
    pageNumber: 14,
    title: 'Big-O Formal Definition & Constructs',
    content: `Big-O Notation Continued:
It shows the maximum time required for execution.
It is defined as the condition that allows an algorithm to complete statement execution in the longest amount of time possible.

O(g(n)) = { f(n) : there exist positive constants c and n0 such that:
0 <= f(n) <= c * g(n) for all n >= n0 }

Analysis of Programming Constructs:
Linear, Quadratic, Cubic, Logarithmic.

Analyzing the efficiency of a program involves characterizing the running time & space usage of algorithms & data structure operations.

1. Running Time:
Running time of DS leads to increase in i/p size, it differs for different i/p of the same size.
Running time is influenced by a lot of factors like h/w & s/w environment.`,
    keyPoints: [
      'f(n) <= c*g(n) for all n >= n0 represents the upper envelope',
      'Scale factors categorize linear, polynomial, and logarithmic curves',
    ],
  },
  {
    pageNumber: 15,
    title: 'Common Functions: Linear, Quadratic, Cubic',
    content: `2. Common Functions used in Analysis:

1. The Linear Function f(n) = n => O(n)
• It is important function.
• An algorithm has a linear time complexity if its execution time increases at the same rate as the input size.
• eg: A loop that iterates through each element of a list once has a linear time complexity.

2. The Quadratic Function f(n) = n^2 => O(n^2)
• An algorithm has a quadratic time complexity if its execution time increases with the square of the input size.
• A nested loop, where each loop iterates through the input size, would result in quadratic time complexity.

3. The Cubic Function f(n) = n^3 => O(n^3)
• An algorithm has a cubic time complexity if its execution time increases with the cube of the input size.
• This often occurs with three nested loops, each iterating through the input.`,
    keyPoints: [
      'Single loop -> O(n)',
      'Double nested loop -> O(n^2)',
      'Triple nested loop -> O(n^3)',
    ],
  },
  {
    pageNumber: 16,
    title: 'The Logarithmic Function O(log n)',
    content: `4. The Logarithmic Function f(n) = log n => O(log n)

• An algorithm has a logarithmic time complexity if its execution time increases logarithmically with the input size.
• This is often seen in algorithms that repeatedly divide the problem into smaller subproblems, like binary search.
• Logarithmic O(log n) means execution time grows very slowly as the i/p size increases, typically in a divide-&-conquer approach.

Summary:
The time complexity of programming constructs like linear, quadratic, cubic & logarithmic functions describes how their execution time scales with the input size.`,
    keyPoints: [
      'O(log n) halves search space each iteration',
      'Standard for binary search, balanced trees, and divide-and-conquer steps',
    ],
  },
  {
    pageNumber: 17,
    title: 'Searching Fundamentals & Types',
    content: `Searching:
Searching is a technique of finding an element in a given list of elements.

List of element could be represented using an:
1. Array
2. Linked list
3. Binary tree
4. B-tree
5. Heap

Searching is one of the core computer science algorithms.
We know that today computers store a lot of information.
To retrieve this information proficiently we need very efficient searching algorithms.

Types of Searching:
1. Linear Search (Sequential Search)
2. Binary Search
3. Sentinel Search`,
    keyPoints: [
      'Linear Search: Unsorted or sorted arrays, O(n)',
      'Binary Search: Sorted arrays only, O(log n)',
      'Sentinel Search: Reduces conditional bound checks in linear scan',
    ],
  },
  {
    pageNumber: 18,
    title: 'Sequential / Linear Search Algorithm',
    content: `1. Sequential Search (Linear Search):
Simple method of searching.
Element is searched in sequential manner.
This algorithm can be applied on both sorted & unsorted list.

Algorithm Steps:
1. Accept element from user which you want to search.
2. Compare the search element with the 0th location element in the list.
3. If both are equal then search is successful. Stop the search & print the found msg.
4. If both are not equal then next element in the list is compared with search element.
5. Repeat step 3 & 4 until search element is compared with last element.
6. If none of element matches with element to search, then display msg: "Element not found."`,
    keyPoints: [
      'Scans array index by index from 0 to n-1',
      'Stops immediately upon match or terminates at array boundary',
    ],
  },
  {
    pageNumber: 19,
    title: 'Linear Search Trace Example',
    content: `Example:
Find position of element 50 using linear search algorithm in given sequence:
[ 10, 20, 30, 40, 50, 60 ]

Step 1:
Index:   0    1    2    3    4    5    | Search ele: 50
Arr:   [10 | 20 | 30 | 40 | 50 | 60]
Compare 0th element: 10 != 50 => Compare next element.

Step 2:
Compare 1st element: 20 != 50 => Compare next element.

Step 3:
Compare 2nd element: 30 != 50 => Compare next element.

Step 4:
Compare 3rd element: 40 != 50 => Compare next element.

Step 5:
Compare 4th position element: 50 == 50
Print the element & position (index 4 / position 5) & stop the search.`,
    keyPoints: [
      'Evaluates comparisons step by step until element match is found',
      'Terminates in 5 comparisons for target 50',
    ],
  },
  {
    pageNumber: 20,
    title: 'Analysis of Linear Search',
    content: `Analysis of Linear Search:
Total number of comparisons are N.

Time Complexity:
• Best Case = O(1) [Element found at 0th position]
• Average Case = O((n+1)/2) = O(n)
• Worst Case = O(n) [Element at last position or not present]

Space Complexity = O(1)

Advantages:
• The linear search is simple.
• This algorithm is applied on both sorted & unsorted list.

Disadvantages:
• Search time is not efficient when list is large & maximum number of comparison are N.`,
    keyPoints: [
      'Best Case: O(1)',
      'Average Case: O(n)',
      'Worst Case: O(n)',
      'Auxiliary Space: O(1)',
    ],
  },
  {
    pageNumber: 21,
    title: 'Binary Search Algorithm',
    content: `2. Binary Search:
Fast searching technique.
This algorithm can be applied only on sorted list.

Mid of array = (Lower + Upper) / 2

Algorithm:
1. Accept element from user which is to be searched.
2. Search element is compared with mid element of the list:
   - If they are equal, then the element is found.
3. Otherwise the list is divided into two parts:
   - First part contains first element to (mid - 1) element.
   - Another part contains (mid + 1) to last element in list.
4. If search element is less than mid then continue search in 1st part, otherwise in 2nd part.
5. Repeat step 2, 3 & 4 until element is found or the division of part gives only one element.`,
    keyPoints: [
      'Prerequisite: List must be sorted',
      'Divides array into halves based on mid comparison',
    ],
  },
  {
    pageNumber: 22,
    title: 'Binary Search Tracing (Example 1)',
    content: `Example:
Find position of element 88 using binary search in array:
A = { 77, 33, 44, 11, 88, 22, 66, 55 }

Sorted List:
A = { 11, 22, 33, 44, 55, 66, 77, 88 }
Index: 0   1   2   3   4   5   6   7

Lower = 0, Upper = 7
Mid = (0 + 7) / 2 = 3 (element = 44)

Check 44 == 88 -> No
88 > 44 -> Search in Second Part!

Then:
Lower = mid + 1 = 3 + 1 = 4
Upper = 7
Mid = (4 + 7) / 2 = 5 (element = 66)`,
    keyPoints: [
      'Pass 1: Mid index 3 (44) < 88 -> shift lower to 4',
      'Pass 2: Mid index 5 (66) < 88 -> shift lower to 6',
    ],
  },
  {
    pageNumber: 23,
    title: 'Binary Search Tracing Continued & Complexity',
    content: `Pass 2 Continued:
Element at index 5 is 66.
Check 66 == 88 -> No
88 > 66 -> continue in 2nd part.

Lower = mid + 1 = 5 + 1 = 6
Upper = 7
Mid = (6 + 7) / 2 = 6 (element = 77)

Check 77 == 88 -> No
88 > 77 -> search in 2nd part.
Lower = mid + 1 = 6 + 1 = 7
Mid = (7 + 7) / 2 = 7 (element = 88)

Check 88 == 88 -> Yes!
Element is found at location index 7 (Position 8).

Analysis of Binary Search:
Time Complexity:
• Best Case = O(1) [Found at initial mid]
• Average Case = O(log n)
• Worst Case = O(log n)`,
    keyPoints: [
      'Found element 88 at index 7 after 4 binary comparisons',
      'Best Case: O(1), Average/Worst: O(log n)',
    ],
  },
  {
    pageNumber: 24,
    title: 'Binary Search Average/Worst Case Analysis',
    content: `Average Case Time Complexity Derivation:
Average Case = log n * (log n + 1) / (2 log n) = O(log n)
Worst Case = O(log n)

Space Complexity:
• Iterative Implementation: O(1)
• Recursive Implementation: O(log n) [Call stack frames]

Comparison Matrix:
| Algorithm | Best Time | Avg Time | Worst Time | Space | Sorted Required? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Linear Search** | O(1) | O(n) | O(n) | O(1) | No |
| **Binary Search** | O(1) | O(log n) | O(log n) | O(1) / O(log n) | Yes |`,
    keyPoints: [
      'Binary search guarantees O(log n) worst-case time',
      'Auxiliary space is O(1) for iterative version',
    ],
  },
  {
    pageNumber: 25,
    title: 'Sorting Overview & Selection Sort',
    content: `Sorting:
Sorting is a technique which is used to rearrange the data elements of a list in a standard form of ascending or descending order, which may be numerical, lexicographical or any user-defined order.
The sorting algorithms are important as it reduces the complexity of a problem.

Types of Sorting Techniques:
1. Comparison-based:
   Bubble sort, Insertion sort, Selection sort, Quick sort, Merge sort, Heap sort.
2. Non-Comparison Based:
   Counting sort, Radix sort.

Selection Sort:
Selection sort is a comparison-based sorting algorithm.
It sorts an array by repeatedly selecting the smallest (or largest) element from the unsorted portion & swapping it with the first unsorted element.
This process continues until the entire array is sorted.`,
    keyPoints: [
      'Comparison-based sorts lower bound: Ω(n log n)',
      'Selection sort repeatedly extracts minimum element from unsorted sub-array',
    ],
  },
  {
    pageNumber: 26,
    title: 'Selection Sort Algorithm & Tracing',
    content: `Selection Sort Algorithm:
1. First we find the smallest element and swap it with the first element. This way we get the smallest element at its correct position.
2. Then we find the smallest among remaining elements & swap it with the second element.
3. We keep doing this until we get all elements moved to correct position.

Example:
Array: [ 64, 25, 12, 22, 11 ]

Step 1:
Current element = 64 (index 0)
Min element in [64, 25, 12, 22, 11] is 11 (index 4).
Swap 64 and 11:
Array becomes: [ 11 | 25, 12, 22, 64 ]

Step 2:
Current element = 25 (index 1)
Min element in [25, 12, 22, 64] is 12 (index 2).
Swap 25 and 12:
Array becomes: [ 11, 12 | 25, 22, 64 ]`,
    keyPoints: [
      'Pass 1 swaps 64 <-> 11',
      'Pass 2 swaps 25 <-> 12',
    ],
  },
  {
    pageNumber: 27,
    title: 'Selection Sort Final Steps & Bubble Sort Intro',
    content: `Selection Sort Step 3 to 6:
Step 3:
Current element = 25 (index 2)
Min element in [25, 22, 64] is 22 (index 3).
Swap 25 and 22:
Array becomes: [ 11, 12, 22 | 25, 64 ]

Step 4:
Current element = 25 (index 3)
Min element in [25, 64] is 25 (index 3).
No swap required.

Step 5:
Current element = 64 (index 4).
Final Sorted Array: [ 11, 12, 22, 25, 64 ]

Bubble Sort:
Bubble sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order.
Not suitable for large data sets.`,
    keyPoints: [
      'Selection Sort Time: O(n^2) all cases, Space: O(1)',
      'Bubble Sort: Adjacent pairwise comparisons and swaps',
    ],
  },
  {
    pageNumber: 28,
    title: 'Bubble Sort Passes & Tracing',
    content: `Bubble Sort Mechanics:
Multiple passes are required.
• After the 1st pass, the largest element goes to end.
• After the 2nd pass, the second largest element goes to second last position, & so on.
In every pass, only those elements are processed that have not moved to correct position.
The process is repeated in unsorted list until all the elements get sorted.

Example:
Consider the array with elements: [ 5, 6, 1, 3 ]

Step 1 (Pass 1): Placing 1st largest element at correct position
i = 0: [5, 6, 1, 3] -> (5 < 6: No swap) -> [5, 6, 1, 3]
i = 1: [5, 6, 1, 3] -> (6 > 1: Swap!)  -> [5, 1, 6, 3]
i = 2: [5, 1, 6, 3] -> (6 > 3: Swap!)  -> [5, 1, 3, 6] (6 sorted at end!)`,
    keyPoints: [
      'Pass 1 bubbles largest value 6 to index 3',
      'Comparisons reduce by 1 each subsequent pass',
    ],
  },
  {
    pageNumber: 29,
    title: 'Bubble Sort Pass 2, 3 & Complexity',
    content: `Bubble Sort Tracing Continued:

Step 2 (Pass 2):
i = 0: [5, 1, 3, 6] -> (5 > 1: Swap!)  -> [1, 5, 3, 6]
i = 1: [1, 5, 3, 6] -> (5 > 3: Swap!)  -> [1, 3, 5, 6] (5 sorted at index 2!)

Step 3 (Pass 3):
i = 0: [1, 3, 5, 6] -> (1 < 3: No swap) -> [1, 3, 5, 6]
Sorted Array: [ 1, 3, 5, 6 ]

Complexity:
• Time Complexity: O(n^2) [Best Case with optimization flag: O(n)]
• Space Complexity: O(1)

Advantages:
- Easy to understand & implement.
- Does not require any additional memory space.
- Stable sorting algorithm.

Disadvantages:
- Not suitable for large data sets.
- Limited real world applications.`,
    keyPoints: [
      'Time Complexity: O(n^2)',
      'Space Complexity: O(1)',
      'Stable: Preserves relative order of duplicate elements',
    ],
  },
  {
    pageNumber: 30,
    title: 'Insertion Sort Concepts & Algorithm Steps',
    content: `3. Insertion Sort:
Simple method to sort numbers in ascending or descending order.
It follows the incremental method.
Here a sub-list is maintained to be sorted which is always sorted.
The array is searched sequentially & unsorted items are moved & inserted into the sorted sub-list.
• Not suitable for larger data sets.
• Time Complexity = O(n^2)

Algorithm Steps:
1. Start with the second element as the first element is assumed to be sorted.
2. Compare the second element with 1st, if 2nd is smaller then swap them.
3. Move to 3rd element, compare it with first two elements & put it in correct position.
4. Repeat until the entire array is sorted.`,
    keyPoints: [
      'Maintains sorted prefix on left, unsorted suffix on right',
      'Best Case (Already sorted): O(n) comparisons',
      'Worst Case (Reverse sorted): O(n^2)',
    ],
  },
  {
    pageNumber: 31,
    title: 'Insertion Sort Step Tracing',
    content: `Example:
Initially Array = [ 23, 1, 10, 5, 2 ]
First element [23] is assumed sorted.

First Pass:
Current element = 1
Compare 1 & 23 -> 1 is smaller so shift 23 right and place 1:
Sorted part: [ 1, 23 | 10, 5, 2 ]

Second Pass:
Current element = 10
Compare 10 with 23 and 1:
10 < 23 and 10 > 1 => insert 10 between 1 & 23.
Sorted part: [ 1, 10, 23 | 5, 2 ]`,
    keyPoints: [
      'Pass 1 places 1 -> [1, 23]',
      'Pass 2 shifts 23 right, inserts 10 -> [1, 10, 23]',
    ],
  },
  {
    pageNumber: 32,
    title: 'Insertion Sort Passes 3 & 4 and Shifting',
    content: `Third Pass:
Array: [ 1, 10, 23, 5, 2 ]
Current element = 5
Compare 5 with 1, 10, 23:
10 > 5 and 23 > 5
Insert 5 between 1 & 10.
Sorted part: [ 1, 5, 10, 23 | 2 ]

Fourth Pass:
Current element = 2
Compare 2 with 1, 5, 10, 23:
Insert 2 between 1 & 5.
Sorted Array: [ 1, 2, 5, 10, 23 ]

Example 2 (Card insertion method):
Remove key element from array to create space, shift larger elements right, then insert key into vacated slot.`,
    keyPoints: [
      'Pass 3 inserts 5 -> [1, 5, 10, 23]',
      'Pass 4 inserts 2 -> [1, 2, 5, 10, 23] (Final)',
    ],
  },
  {
    pageNumber: 33,
    title: 'Insertion Sort Shifting Mechanism',
    content: `Shift all elements greater than key by one index to right:
Sorted: [4, 7 | 6, 5] (Key = 6)
1. Remove key 6: Space created at index 2.
2. Compare 7 with 6: 7 > 6 -> Move 7 to index 2.
3. Compare 4 with 6: 4 < 6 -> No shifting.
4. Fill 6 into space at index 1:
Array becomes: [ 4, 6, 7 | 5 ]

Next: Including 5 (Key = 5):
1. Shift 7 and 6 to right.
2. Insert 5 at index 1:
Array becomes: [ 4, 5, 6, 7 ]`,
    keyPoints: [
      'In-place shift eliminates full swaps, replacing with single writes',
    ],
  },
  {
    pageNumber: 34,
    title: 'Merge Sort: Divide & Conquer',
    content: `4. Merge Sort:
Merge sort is a popular sorting algorithm known for its efficiency & stability.
It follows the "divide and conquer" approach.
It works by recursively dividing the input array into two halves, recursively sorting the two halves & finally merging them back together to obtain the sorted array.

Step by step explanation:
1. Divide:
Divide the list or array recursively into two halves until it can no more be divided (single element base case).

2. Conquer:
Each sub-array is sorted individually using recursive calls.

3. Merge:
The sorted sub-arrays are merged back together in sorted order.`,
    keyPoints: [
      'Divide: Find mid = (low + high)/2',
      'Conquer: Recursively sort left and right halves',
      'Merge: Two-pointer zip into temporary array',
    ],
  },
  {
    pageNumber: 35,
    title: 'Merge Sort Tree Splitting Diagram',
    content: `Merge Sort Splitting Tree Example:
Array to be sorted: [ 38, 27, 43, 10 ]

Step 1: Splitting array into two equal halves
               [ 38, 27, 43, 10 ]
                 /            \\
           [ 38, 27 ]      [ 43, 10 ]

Step 2: Splitting sub-arrays into single unit length cells
           [ 38, 27 ]      [ 43, 10 ]
            /      \\        /      \\
          [38]    [27]    [43]    [10]`,
    keyPoints: [
      'Tree depth is log2(n) levels',
      'Leaves represent trivially sorted single-element arrays',
    ],
  },
  {
    pageNumber: 36,
    title: 'Merge Sort Merging Phase & Complexity',
    content: `Step 3: Merging unit length cells into sorted sub-arrays
[38] and [27] ──(Merge)──> [ 27, 38 ]
[43] and [10] ──(Merge)──> [ 10, 43 ]

Step 4: Merging sorted sub-arrays into sorted array
[ 27, 38 ] and [ 10, 43 ] ──(Merge)──> [ 10, 27, 38, 43 ]

Complexity Analysis:
• Time Complexity = O(n log n) [Best, Average, and Worst Case]
• Space Complexity = O(n) [Requires temporary merge buffer]

Advantages:
1. Stability (preserves order of identical keys).
2. Guaranteed worst-case performance O(n log n).
3. Simple to implement on linked lists (O(1) auxiliary space for linked lists).
4. Naturally parallelizable.`,
    keyPoints: [
      'Time Complexity: Θ(n log n) across all cases',
      'Space Complexity: O(n)',
      'Highly stable and predictable',
    ],
  },
  {
    pageNumber: 37,
    title: 'Quick Sort: Partition Algorithm',
    content: `5. Quick Sort:
Quick sort is a sorting algorithm based on Divide & Conquer that picks an element as a pivot and partitions the array around the pivot.

Algorithm:
1. Choose a Pivot:
Select the element from the array as the pivot (First element, Last element, Random element, or Median).

2. Partition the Array:
Rearrange the array around the pivot.
After partitioning, all elements smaller than the pivot will be on its left & greater than pivot will be on its right.

3. Recursively Call:
Recursively apply the same process to the two partitioned sub-arrays.

4. Base Case:
The recursion stops when there is only one element left in the sub-array, as a single element is already sorted.`,
    keyPoints: [
      'In-place partition: elements < pivot left, elements > pivot right',
      'Average Time: O(n log n), Worst Time (poor pivot): O(n^2)',
    ],
  },
  {
    pageNumber: 38,
    title: 'Quick Sort Partition Tracing Example',
    content: `Example:
Array: [ 7, 1, 3, 5, 2, 6, 4 ]
Pivot chosen = 4

Rearrange array so 4 comes in correct position (all elements < 4 to left, > 4 to right):
Partition result:
Left of 4: [ 1, 3, 2 ] | Pivot: [ 4 ] | Right of 4: [ 7, 5, 6 ]

Apply partition on Left of 4: [ 1, 3, 2 ]
Pivot = 2
Left of 2: [ 1 ] | Pivot: [ 2 ] | Right of 2: [ 3 ]
Result: [ 1, 2, 3 ]

Apply partition on Right of 4: [ 7, 5, 6 ]
Pivot = 6
Left of 6: [ 5 ] | Pivot: [ 6 ] | Right of 6: [ 7 ]
Result: [ 5, 6, 7 ]`,
    keyPoints: [
      'Left partition: [1, 2, 3]',
      'Center pivot: [4]',
      'Right partition: [5, 6, 7]',
    ],
  },
  {
    pageNumber: 39,
    title: 'Quick Sort Completion & Radix Sort Algorithm',
    content: `Final Quick Sort Array:
[ 1, 2, 3, 4, 5, 6, 7 ]
All elements in correct position!

6. Radix Sort:
Radix sort is a step-wise non-comparison sorting algorithm that starts the sorting from the least significant digit (LSD) to the most significant digit (MSD) of the input elements.

Algorithm:
1. Check whether all input elements have same number of digits. If not, find maximum number of digits and pad leading zeros to smaller ones.
2. Take the least significant digit of each element.
3. Sort these digits & change the order based on the output achieved (using a stable sort like Counting Sort).
4. Repeat step 2 for next LSD until all digits are sorted.
5. The final list achieved after k-th loop is sorted!`,
    keyPoints: [
      'Non-comparison integer sort running in O(d * (n + b)) time',
      'd = number of digits, b = base/radix (typically 10)',
    ],
  },
  {
    pageNumber: 40,
    title: 'Radix Sort Complete Tracing Example',
    content: `Example:
Sort elements: [ 904, 46, 5, 74, 62, 1 ]
Pad with leading zeros: [ 904, 046, 005, 074, 062, 001 ]

Pass 1 (Sort by Least Significant Digit - 1s place):
001 (1), 062 (2), 904 (4), 074 (4), 005 (5), 046 (6)
Array after Pass 1: [ 001, 062, 904, 074, 005, 046 ]

Pass 2 (Sort by 10s place digit):
001 (0), 005 (0), 904 (0), 046 (4), 062 (6), 074 (7)
Array after Pass 2: [ 001, 005, 904, 046, 062, 074 ]

Pass 3 (Sort by Most Significant Digit - 100s place):
001 (0), 005 (0), 046 (0), 062 (0), 074 (0), 904 (9)
Final Sorted Array: [ 1, 5, 46, 62, 74, 904 ]

Practice Exercise:
Apply Radix Sort on: [ 15, 1, 321, 10, 802, 2, 123, 90, 109, 11 ]`,
    keyPoints: [
      'Pass 1 (units digit) -> Pass 2 (tens digit) -> Pass 3 (hundreds digit)',
      'Stable buckets preserve intermediate order',
      'Final Array is strictly sorted in ascending order',
    ],
  },
];

export const DSA_HASHING_PAGES: PdfPageContent[] = [
  {
    pageNumber: 1,
    title: 'Unit I: Hashing Introduction & Motivation',
    content: `Unit I: Hashing

Hashing:
Hashing is the process of indexing and retrieving element (data) in a data structure to provide faster way of finding the element using the hash key.
• The main objective of hashing is to get time complexity O(1).
• With hashing we get O(1) search time on average and O(n) search time on worst case.

Need of Hashing:
Suppose we want to design a system for storing students record and we want to perform following operations efficiently:
Insert, Search & Delete operation on basis of student Id.

Class studentInfo {
    long Id;
    String name;
    String class;
};`,
    keyPoints: [
      'Hashing maps keys to indices in O(1) expected time',
      'Supports efficient Insert, Search, and Delete operations',
      'Replaces linear and tree lookups for key-value systems',
    ],
    diagramText: `[ Key / ID ] ──(Hash Function h(k))──> [ Array Index ] ──> [ Record / Data ]`,
  },
  {
    pageNumber: 2,
    title: 'Hash Table Structure & Comparison',
    content: `Data Structure Performance Comparison:
• An array implementation would take O(log n) time in binary search (if sorted) or O(n) unsorted.
• A linked list implementation would take O(n) time.
So is there an alternative to get O(1) access time?
So here comes the concept of hashing!

Hash Table:
Hash table is a data structure used for storing and retrieving data quickly.
All data is inserted into hash table based on hash key value. It is used to map the data with the index in hash table.

Schematic:
Key ──> [ Hash Function ] ──> Index: 0, 1, 2, 3, 4, 5 ... N in Hash Table [Actual Data Stored]`,
    keyPoints: [
      'Array binary search: O(log n), Linked list: O(n)',
      'Hash table achieves O(1) average lookup',
      'Hash Function acts as the translation engine from Key space to Index space',
    ],
  },
  {
    pageNumber: 3,
    title: 'Buckets, Collision, Probe & Overflow Terminology',
    content: `Key Hashing Terminology:

Buckets:
A bucket is in a hash file a unit of storage (typically a disk block) that can hold one or more records. The hash table consists of b buckets and each bucket consists of s slots. (Usually s = 1).

Collision:
Collision is situation in which hash function returns the same address for more than one record. (h(k1) == h(k2) for k1 != k2).

Probe:
Alternative list of location produced after collision occurs.

Synonym:
The set of keys that hash to the same location are called as synonyms.

Overflow:
When hash table becomes full and new record needs to be inserted, then it is called overflow. An overflow occurs when we hash a new identifier into a full bucket.`,
    keyPoints: [
      'Bucket: Unit of storage holding s slots',
      'Collision: Two distinct keys mapping to identical hash index',
      'Synonyms: Set of keys {k1, k2, ...} where h(k1) = h(k2)',
      'Overflow: Insertion attempt into already saturated bucket',
    ],
  },
  {
    pageNumber: 4,
    title: 'Perfect Hash Function & Load Factor (λ)',
    content: `Perfect Hash Function:
It is a function that maps distinct key elements into hash table with no collision.

Load Factor or Load Density of Hash Table:
λ = n / m
Where:
• n = no. of elements stored in table.
• m = size of table.

Hash Functions:
A hash function is any function that can be used to map a data set of an random size to a data set of a fixed size, which falls into the hash table.
The values returned by a hash function are called hash values, hash codes, hash sums or hashes.

Properties of Good Hash Functions:
1. Easy to compute & quick to compute.
2. Minimize collisions.
3. Distribute key values evenly in hash table (Uniform Hashing).
4. Use all information provided in the key.`,
    keyPoints: [
      'Load Factor λ = n / m (elements / table capacity)',
      'Uniform distribution avoids clustering',
      'Computation must be O(1) with minimal CPU overhead',
    ],
  },
  {
    pageNumber: 5,
    title: 'Hash Function: Division Method',
    content: `The hash function converts the key into the table position.
It can be carried out using:

1. Division Method:
Compute the index by dividing the key with some value & use the remainder as the index.
It gives indexes in range 0 to m-1 for hash table of size m.
Map a key k into one of the m slots by taking the remainder of k divided by m:

h(k) = k mod m

Example:
index = key mod table_size
Consider key = 82 & table size = 10
index = 82 % 10 = 2

Keys:
• 79 % 10 = 9 -> Bucket [09]
• 68 % 10 = 8 -> Bucket [08]
• 82 % 10 = 2 -> Bucket [02]`,
    keyPoints: [
      'h(k) = k mod m',
      'm is usually chosen as a prime number not close to power of 2 to reduce collisions',
    ],
  },
  {
    pageNumber: 6,
    title: 'Multiplication Method & Knuth Constant',
    content: `Advantage & Disadvantage of Division Method:
• Advantage: Fast — requires only one arithmetic mod operation.
• Disadvantage: Certain values of m are not good choices (eg: powers of 2 like 32 or 1024 lead to collisions based on low-order bits).

2. Multiplication Method:
Steps to be followed:
1. Choose constant A in range 0 < A < 1.
2. Multiply key k by A.
3. Extract fractional part of k*A (gives number between 0 and 1).
4. Multiply fractional part by m & take floor of the result:

h(k) = floor( m * ( (k * A) mod 1 ) )

Knuth recommends:
A = (sqrt(5) - 1) / 2 ≈ 0.6180339887... (The Golden Ratio inverse!)

Example:
key k = 1, m = 8 slots, A = 0.61
k * A = 1 * 0.61 = 0.61
floor(0.61 * 8) = floor(4.88) = 4 -> Slot 4.`,
    keyPoints: [
      'h(k) = ⌊ m * (k*A mod 1) ⌋',
      'Golden ratio multiplier A ≈ 0.618 gives excellent hash dispersion',
    ],
  },
  {
    pageNumber: 7,
    title: 'Extraction Method & Folding Method',
    content: `3. Extraction Method:
Selected digits are extracted from the key & used as address.
Address = selected digits from key.
eg: If six digit employee no. is 379245, then first three digits are selected as index i.e. 379.
Disadvantage:
May not evenly distribute key values in the hash table.

4. Folding Method:
It involves splitting keys into two or more parts and then combining the parts to form the hash addresses.
To map key 25936715 to a range between 0 & 9999:
• Split the number into parts: 2593 and 6715.
• Add these two to obtain: 2593 + 6715 = 9308 as the hash value.
- Very useful if we have keys that are very large.
Advantage: Fast & simple especially with bit patterns.`,
    keyPoints: [
      'Extraction: Select fixed bit/digit positions',
      'Folding: Partition key into chunks and sum/XOR them',
    ],
  },
  {
    pageNumber: 8,
    title: 'Mid-Square Method & Universal Hashing',
    content: `5. Mid-Square Method:
The key is squared & the middle part of the result taken as the hash value.
To map key 3121 into hash table of size 1000:
1. Square key: 3121^2 = 9740641
2. Extract middle 3 digits: 406 as hash value.

Advantage: Works well if keys do not contain a lot of leading or trailing zeroes.
Disadvantage: Non-integer keys have to be pre-processed into integers.

6. Universal Method (Universal Hashing):
For any hash function, if table size m is much smaller than universe size U, then for any hash function h, there is some large subset of U that has the same hash value.
So we select a hash function at random from a carefully designed family of hash functions at runtime!`,
    keyPoints: [
      'Mid-square: k^2 middle bits capture dispersion from all input digits',
      'Universal Hashing: Randomized hash family prevents worst-case adversarial collisions',
    ],
  },
  {
    pageNumber: 9,
    title: 'Overflow Handling Strategies',
    content: `Overflow:
When the load factor (L.F) is greater than or equal to one, it is known as overflow.

Overflow may be handled by:
1. Search the hash table in some systematic fashion for a bucket that is not full (Open Addressing).
2. Linear probing.
3. Quadratic probing.
4. Random probing.
5. Eliminate overflows by permitting each bucket to keep a list of all pairs for which it is the home bucket (Separate Chaining).`,
    keyPoints: [
      'Open Addressing: Finds next available slot in table',
      'Chaining: Stores synonyms in external linked list',
    ],
  },
  {
    pageNumber: 10,
    title: 'Perfect Hash Function & Load Density (α)',
    content: `Perfect Hash Function:
Perfect hash function for a set S is a hash function that maps distinct elements in S to a set of integers, with no collisions.
In mathematical terms, it is an injective function.
Perfect hash functions may be used to implement a lookup table with constant worst-case access time O(1).

Load Density:
The loading density or loading factor of a hash table is:
α = n / (s * b)
Where:
• s = no. of slots per bucket
• b = no. of buckets
• n = no. of stored records

Full Table:
A table in which all locations are filled with values and no location is remained empty is known as Full Table.`,
    keyPoints: [
      'Injective mapping ensures zero collisions',
      'Load density α = n / (s*b)',
    ],
  },
  {
    pageNumber: 11,
    title: 'Rehashing & Dynamic Hashing Intro',
    content: `Rehashing:
The most common rehashing technique is to construct a new table of approximately double size of the original hash table.
Rehashing is a costly operation and it happens frequently when the hash table is small & there are lot of insertions.
The time required for rehashing is O(n) since N elements need to be rehashed from the original hash table into the new one.

When to Rehash:
1. Rehash when table is half full (λ > 0.5 or 0.75).
2. Rehash as soon as insertion fails.
3. Rehash beyond a certain load factor threshold.

Advantages of Rehashing:
1. No need to consider the table size while inserting data.
2. Hash tables cannot be made arbitrarily large to start with in complex programs.
3. Rehashing can be used for other data structures as well.

Extendable Hashing:
Dynamic hashing method where bulky disk accesses are reduced.`,
    keyPoints: [
      'Rehash creates ~2x table and re-maps all keys: O(n) cost',
      'Amortized cost per insertion remains O(1)',
    ],
  },
  {
    pageNumber: 12,
    title: 'Extendable Hashing: Global & Local Depth',
    content: `Extendable Hashing:
Extendable hashing reduces disk accesses while retrieving data. It handles large amount of data dynamically.

Global Depth:
It is associated with the directories. They denote the number of bits which are used by the hash function to categorize the keys.
Global Depth = Number of bits in directory.

Local Depth:
Local Depth is associated with the buckets. Local depth in accordance with the global depth is used to decide the action to be performed in case an overflow occurs.
Local Depth is always less than or equal to the Global Depth.

Bucket Splitting:
When the number of elements in a bucket exceeds a particular size, then the bucket is split into two parts.

Directory Expansion:
Directory expansion takes place when a bucket overflows and its Local Depth equals Global Depth.`,
    keyPoints: [
      'Global Depth (D): Directory indexing bit length',
      'Local Depth (d): Bucket indexing bit length (d <= D)',
      'Split when bucket fills; double directory when d == D',
    ],
  },
  {
    pageNumber: 13,
    title: 'Extendable Hashing Step-by-Step Example',
    content: `Extendable Hashing Steps:
1. Analyze the data elements (type). Convert data type to binary format.
2. Check Global depth of the directory.
3. Identify directory & navigation pointer.
4. Insertion & overflow check.
5. Tackling overflow condition during data insertion.
6. If required, do rehashing of split bucket elements.

Example:
Elements: 16, 4, 6, 22, 24, 10, 31, 7, 9, 20, 26
Bucket Size: 3 | Hash Function: Returns x LSBs

Decimal to Binary:
• 16: 10000    • 10: 01010
• 4:  00100    • 31: 11111
• 6:  00110    • 7:  00111
• 22: 10110    • 9:  01001
• 24: 11000    • 20: 10100`,
    keyPoints: [
      'LSB bits direct record to target bucket pointer',
      'Overflow triggers local split or global directory doubling',
    ],
  },
  {
    pageNumber: 14,
    title: 'Directory Tree & Issues in Hashing',
    content: `Directory Pointer Mapping:
Directory (Global Depth = 3):
[000] ──> Bucket [16, 24] (Local Depth = 3)
[001] ──> Bucket [9] (Local Depth = 3)
[010] ──> Bucket [10] (Local Depth = 3)
[011] ──> Bucket [4, 20] (Local Depth = 3)
[100] ──> Bucket [6, 22] (Local Depth = 3)
[111] ──> Bucket [31, 7] (Local Depth = 3)

Issues in Hashing:
Hash tables are extremely useful data structures as lookups take expected O(1) time on average.
Several data structure & algorithms problems can be very efficiently solved using hashing which otherwise have high time complexity.`,
    keyPoints: [
      'Directory pointers multiplex to shared buckets when local depth < global depth',
      'Constant disk I/O guarantee for database indexing',
    ],
  },
  {
    pageNumber: 15,
    title: 'Top Classic Problems Solved Using Hashing',
    content: `Problems that can be Solved using Hashing:
1. Find pair with given Sum in the array (Two Sum in O(n)).
2. Shuffle a given array of elements.
3. Find majority element in an array (Boyer-Moore voting / Hash frequency).
4. Find sub-array with 0 sum (Prefix sum hashing).
5. Find maximum length sub-array having given sum.
6. Find maximum length sub-array having equal number of 0s & 1s.
7. Find a duplicate element in a limited array range.
8. Find largest sub-array formed by consecutive integers.
9. Find Triplet with given sum in an array.
10. Custom sort / sort elements by their frequency & index.`,
    keyPoints: [
      'Reduces brute-force O(n^2) and O(n^3) search to linear O(n)',
      'Essential for coding interviews and high-throughput systems',
    ],
  },
  {
    pageNumber: 16,
    title: 'Collision Mechanics & Synonym Sets',
    content: `Collision:
When two different keys produce the same address, there is a collision. The keys involved are called synonyms.
It is extremely difficult to avoid collision with a hashing function.
It is best to find ways to deal with them:
• Spread out the records.
• Use extra memory.
• Put more than one record at a single address.

Example of Collision:
Hash table size: 11 | Hash function: key mod 11
Keys: [ 23, 18, 29, 28, 39, 13, 16, 42, 17 ]
Positions:
• 23 % 11 = 1
• 18 % 11 = 7
• 29 % 11 = 7  <-- Collision with 18!
• 28 % 11 = 6
• 39 % 11 = 6  <-- Collision with 28!
• 17 % 11 = 6  <-- Triple collision at slot 6!

Collision occurs when h(k1) == h(k2).`,
    keyPoints: [
      'Pigeonhole principle guarantees collisions when n > m',
      'Resolution techniques handle collisions deterministically',
    ],
  },
  {
    pageNumber: 17,
    title: 'Strategies: Chaining vs Open Addressing',
    content: `Strategies used for Collision Resolution:

1. Chaining (Open Hashing / Separate Chaining):
Store colliding keys in a linked list at the same hash table index.
In this method, a separate list of all elements that map to the same value (hash value) is maintained.
• If memory space is very less, this method is advantageous.
• Additional space is required to store addresses of head arrays and pointers.

Advantages:
- Collision resolution is simple.
- No problem of load factor > 1 (can hold more number of elements than table size).
- Table size need not be a prime number.`,
    keyPoints: [
      'Separate Chaining keeps linked list per slot',
      'Table can store > m elements gracefully',
    ],
  },
  {
    pageNumber: 18,
    title: 'Disadvantages of Chaining & Open Addressing Intro',
    content: `Disadvantages of Chaining:
1. Linked list could get long. Longer linked lists could negatively impact performance (degrades to O(n)).
2. More memory utilization because of pointers.

Example of Chaining:
Map numbers: [ 5, 18, 55, 78, 35, 6 ], Table size = 10
• Slot 5: [5] -> [55] -> [35] -> NULL
• Slot 6: [6] -> NULL
• Slot 8: [18] -> [78] -> NULL

Open Addressing / Closed Hashing:
Open addressing / probing is carried out for insertion into fixed size hash tables.
If the index given by the hash function is occupied, then there is need to find another bucket for the element to be stored. Then increment the table position by some probe sequence.`,
    keyPoints: [
      'Pointers consume memory overhead in chaining',
      'Open addressing stores all elements directly in the table array',
    ],
  },
  {
    pageNumber: 19,
    title: 'Open Addressing: Linear Probing Method',
    content: `Open Addressing Techniques:
1. Linear Probing:
It generates a probe sequence of slots in the hash table & we need to choose the proper slot for key 'x'.
Suppose that a key hashes into a position that has been already occupied. The simplest strategy is to look for the next available position to place the item.
Table remains a simple array of size m.

On insert(x):
First compute h(x) = x mod m
If collision occurs, find another location by sequentially searching for the next available slot:
Go to (h(x) + 1) mod m, (h(x) + 2) mod m, etc.

Example:
Insert keys into table of size m = 7:
h(x) = x mod 7
Keys: { 76, 93, 40, 47, 10, 55 }`,
    keyPoints: [
      'Probe function: p(i) = i',
      'h_i(x) = (h(x) + i) mod m',
      'Simple but causes Primary Clustering',
    ],
  },
  {
    pageNumber: 20,
    title: 'Linear Probing Insertion Table Trace',
    content: `Step-by-Step Insertion Tracing (m = 7):
• insert(76): 76 % 7 = 6 -> Slot [6] (1 probe)
• insert(93): 93 % 7 = 2 -> Slot [2] (1 probe)
• insert(40): 40 % 7 = 5 -> Slot [5] (1 probe)
• insert(47): 47 % 7 = 5 (Occupied!) -> Probe 6 (Occupied!) -> Slot [0] (3 probes)
• insert(10): 10 % 7 = 3 -> Slot [3] (1 probe)
• insert(55): 55 % 7 = 6 (Occupied!) -> Probe 0 (Occupied!) -> Slot [1] (3 probes)

Linear Probing with Chaining (Without Replacement):
Extra field (chain pointer) is added to maintain indexes of synonyms.
Keys: { 0, 1, 4, 71, 64, 89, 11, 88 }, m = 10
If collision occurs, link synonym index via chain field.`,
    keyPoints: [
      'Shows probe count per key insertion',
      'Chain field maintains linked synonym pointers inside array',
    ],
  },
  {
    pageNumber: 21,
    title: 'Linear Probing: With vs Without Replacement',
    content: `Linear Probing with Chaining (With Replacement):
Problem of misplaced starting location of the chain is handled!
If a new key hashes to its home bucket which is currently occupied by a colliding key from another bucket, the intruder is evicted & replaced!

Comparison:
Without Replacement:
- Intruders remain in place; chain pointer points to displaced synonym.
With Replacement:
- Home key always gets its natural slot; intruders re-located to next free slot.
- Shorter search chain length on average!`,
    keyPoints: [
      'With Replacement evicts non-home intruders to preserve direct hash lookups',
      'Lowers average lookup probes compared to without-replacement',
    ],
  },
  {
    pageNumber: 22,
    title: 'Quadratic Probing Technique',
    content: `2. Quadratic Probing:
One way to reduce primary clustering is to use quadratic probing to solve collision.
We start from original hash location i. If collision occurs, search for i + 1^2, i + 2^2, i + 3^2, ...

Hash Function:
h_i(x) = ( h(x) + i^2 ) mod m
Where i = 0, 1, 2, 3, ...

Example:
Table size m = 7, h(x) = x mod 7
Keys: { 76, 40, 48, 5, 55 }
• insert(76): 76 % 7 = 6 -> Slot [6]
• insert(40): 40 % 7 = 5 -> Slot [5]
• insert(48): 48 % 7 = 6 (Collision!) -> (6 + 1^2) % 7 = 0 -> Slot [0] (2 probes)
• insert(5):  5 % 7 = 5 (Collision!) -> (5 + 1^2) % 7 = 6 (Collision!) -> (5 + 2^2) % 7 = 2 -> Slot [2] (3 probes)

Advantage: Resolves primary clustering!
Disadvantage: Secondary clustering can still occur; no guarantee of finding slot if table is not prime and > half full.`,
    keyPoints: [
      'Probe function: p(i) = i^2',
      'Eliminates primary clustering runs',
    ],
  },
  {
    pageNumber: 23,
    title: 'Double Hashing Technique',
    content: `3. Double Hashing:
It reduces the clustering in a better way.
• Use primary hash function h1(k) to determine the first slot.
• Use a second hash function h2(k) to determine the increment for the probe sequence.

h(k, i) = ( h1(k) + i * h2(k) ) mod m, for i = 0, 1, 2, ...

Initial probe: h1(k)
Second probe is offset by h2(k) mod m, so on.
Advantage: Avoids both primary and secondary clustering!

Example:
m = 7, h1(x) = x mod 7, h2(x) = 5 - (x mod 5)
Keys: { 76, 40, 48, 5, 55 }
• insert(76): h1 = 6 -> Slot [6]
• insert(48): h1 = 6 (Col!), h2 = 5 - (48%5) = 2 -> (6 + 1*2)%7 = 1 -> Slot [1] (2 probes)`,
    keyPoints: [
      'h(k, i) = (h1(k) + i * h2(k)) mod m',
      'h2(k) must never evaluate to 0 and must be relatively prime to m',
      'Gold standard in open addressing',
    ],
  },
  {
    pageNumber: 24,
    title: 'Skip List: Probabilistic Data Structure',
    content: `Skip List:
A skiplist is a probabilistic data structure and an extended version of the linked list.
• The skip-list is used to store a sorted list of elements or data with a linked list and is very useful for concurrently accessing elements.
• In single step, it skips elements of the entire list, hence referred as skip list.
• It allows the user to search, remove and insert the element very quickly.

Operations:
1. Insertion Operation: Used to add a new node with randomly chosen height.
2. Deletion Operation: Used to delete a node in a specific situation.
3. Search Operation: Used to search a particular node in a skip list.`,
    keyPoints: [
      'Multi-level express pointers skip elements in O(log n) time',
      'Simpler alternative to balanced BSTs (AVL, Red-Black)',
    ],
  },
  {
    pageNumber: 25,
    title: 'Skip List Complexity & Applications',
    content: `Skip List Performance & Applications:

Average case time complexity of all operations is O(log n):
• Search: O(log n)
• Insert: O(log n)
• Delete: O(log n)
Worst Case: O(n) (rare degenerate coin-flip sequence)

Applications of the Skip List:
1. It is used in distributed applications.
2. In distributed systems, the nodes of skip list represent the computer systems and pointers represent network connections.
3. Used in in-memory key-value databases like Redis (Sorted Sets / ZSET).
4. Used in LSM-tree MemTables (LevelDB, RocksDB) for concurrent lock-free inserts.`,
    keyPoints: [
      'Average Complexity: O(log n) for Search, Insert, Delete',
      'Widely used in Redis Sorted Sets and LevelDB MemTables',
    ],
  },
];
