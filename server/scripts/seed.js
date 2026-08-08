require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const RoadmapTemplate = require('../models/roadmapTemplate');
const User = require('../models/user');
const UserProgress = require('../models/userProgress');

// Phase Constants
const p1_de = 'PHASE 1 — SQL & DATA ENGINEERING FOUNDATIONS';
const p2_de = 'PHASE 2 — PYTHON';
const p3_de = 'PHASE 3 — PYSPARK';
const p4_de = 'PHASE 4 — DATABRICKS + DELTA LAKE';
const p5_de = 'PHASE 5 — REAL DATA ENGINEERING';
const p6_de = 'PHASE 6 — PORTFOLIO PROJECT';
const p7_de = 'PHASE 7 — INTERVIEW PREPARATION';

const p1_fs = 'PHASE 1 — HTML, CSS & JAVASCRIPT BASICS';
const p2_fs = 'PHASE 2 — TOOLING & GIT';
const p3_fs = 'PHASE 3 — REACT FRONTEND';
const p4_fs = 'PHASE 4 — NODE.JS BACKEND';
const p5_fs = 'PHASE 5 — DATABASES';
const p6_fs = 'PHASE 6 — ADVANCED BACKEND & AUTH';
const p7_fs = 'PHASE 7 — TESTING, DEVOPS & DEPLOYMENT';

const p1_jv = 'PHASE 1 — JAVA CORE PROGRAMMING';
const p2_jv = 'PHASE 2 — OBJECT ORIENTED JAVA';
const p3_jv = 'PHASE 3 — JAVA DATA STRUCTURES & COLLECTIONS';
const p4_jv = 'PHASE 4 — ADVANCED CORE FEATURES';
const p5_jv = 'PHASE 5 — BUILD SYSTEMS & SQL';
const p6_jv = 'PHASE 6 — SPRING CORE & SPRING BOOT';
const p7_jv = 'PHASE 7 — REST APIS & MICROSERVICES';

const p1_fl = 'PHASE 1 — DART PROGRAMMING BASICS';
const p2_fl = 'PHASE 2 — FLUTTER CORE WIDGETS';
const p3_fl = 'PHASE 3 — SCROLLABLE VIEWS & CUSTOM LOOKS';
const p4_fl = 'PHASE 4 — NAVIGATION & ROUTING';
const p5_fl = 'PHASE 5 — STATE MANAGEMENT';
const p6_fl = 'PHASE 6 — API INTEGRATION';
const p7_fl = 'PHASE 7 — DATABASES, TESTING & RELEASES';

// Load Data Engineering Roadmap
const deRoadmap = [
  { dayNumber: 1, phase: p1_de, topic: 'Relational Data + SQL Foundations', description: 'Establish strong foundational knowledge in relational modeling, standard and advanced SQL operators, and core concepts of data quality engineering like deduplication and integrity check systems.', tasks: ['Create relational tables', 'Oracle data types', 'Primary keys', 'Default values', 'INSERT', 'INSERT SELECT', 'CONNECT BY LEVEL', 'LPAD', 'CASE', 'MOD', 'TO_CHAR', 'DBMS_RANDOM', 'JOIN', 'LEFT JOIN', 'GROUP BY', 'HAVING', 'COUNT', 'SUM', 'NULL validation', 'Duplicate detection', 'Referential integrity', 'Data reconciliation', 'ROW_NUMBER introduction', 'Bronze/Silver/Gold introduction'] },
  { dayNumber: 2, phase: p1_de, topic: 'Advanced SQL & Window Functions', description: 'Learn window partitioning, order execution, offsets, and analytical expressions to handle top-N analytical requests, deduplication logic, and cumulative sums.', tasks: ['ROW_NUMBER', 'RANK', 'DENSE_RANK', 'LAG', 'LEAD', 'SUM OVER', 'AVG OVER', 'Top-N queries', 'Latest record per customer', 'Deduplication', 'Running totals', 'Customer ranking', 'Product ranking'] },
  { dayNumber: 3, phase: p1_de, topic: 'CTEs & Complex SQL', description: 'Understand Common Table Expressions, query nesting, subquery options, and code modularization to write maintainable complex queries.', tasks: ['WITH', 'CTEs', 'Subqueries', 'Nested queries', 'Complex transformations', 'Business-analysis queries'] },
  { dayNumber: 4, phase: p1_de, topic: 'SQL Performance', description: 'Dive into indexing structures, scanning patterns, execution plans, and join methodologies to write high-performing queries.', tasks: ['Indexes', 'Composite indexes', 'Execution plans', 'EXPLAIN PLAN', 'Full table scan', 'Index scan', 'Join optimization', 'Query optimization'] },
  { dayNumber: 5, phase: p1_de, topic: 'ETL SQL', description: 'Build robust staging architectures, mapping strategies, structural load patterns, and conditional UPSERT (MERGE) logic.', tasks: ['Staging tables', 'Extract', 'Transform', 'Load', 'MERGE', 'Upsert', 'Insert/update logic', 'Validation'] },
  { dayNumber: 6, phase: p1_de, topic: 'Incremental Loading', description: 'Contrast full snapshot processing against incremental loading using timestamps, auto-increments, and watermarking patterns.', tasks: ['Full load', 'Incremental load', 'CREATED_DATE', 'MODIFIED_DATE', 'Watermarks', 'New records', 'Changed records'] },
  { dayNumber: 7, phase: p1_de, topic: 'Change Data Capture', description: 'Examine logs, triggers, change tables, and watermarks to track inserts, updates, and deletes from a source database.', tasks: ['INSERT changes', 'UPDATE changes', 'DELETE changes', 'CDC concepts', 'Change tracking', 'Watermarks'] },
  { dayNumber: 8, phase: p1_de, topic: 'Slowly Changing Dimensions', description: 'Implement SCD Type 1 (overwrites) and Type 2 (historical records with effective dates, end dates, and current record flags).', tasks: ['SCD Type 1', 'SCD Type 2', 'Historical records', 'Effective dates', 'End dates', 'Current flag'] },
  { dayNumber: 9, phase: p1_de, topic: 'Data Quality Engineering', description: 'Construct validation checks checking primary key integrity, nullability, column formatting rules, and orphan references.', tasks: ['Duplicate checks', 'NULL checks', 'Invalid formats', 'Orphan records', 'Referential checks', 'Business-rule validation', 'Reconciliation'] },
  { dayNumber: 10, phase: p1_de, topic: 'SQL Interview Day', description: 'Consolidate SQL knowledge by tackling realistic interview assignments covering window functions, CTEs, optimization, and edge cases.', tasks: ['SQL interview questions', 'Window functions', 'Joins', 'CTEs', 'Aggregations', 'Data-quality scenarios', 'Practical SQL problems'] },
  { dayNumber: 11, phase: p2_de, topic: 'Python Fundamentals', description: 'Review variable scopes, native collections, conditional pathways, control structures, and iterable loops in Python.', tasks: ['Variables', 'Data types', 'Lists', 'Tuples', 'Sets', 'Dictionaries', 'Conditions', 'Loops'] },
  { dayNumber: 12, phase: p2_de, topic: 'Python Functions & Error Handling', description: 'Author custom reusable functions, lambda expressions, variable arguments, exception catching blocks, and module imports.', tasks: ['Functions', 'Lambda', '*args', '**kwargs', 'Exceptions', 'Modules'] },
  { dayNumber: 13, phase: p2_de, topic: 'Python Files & Data', description: 'Read and write local files (CSV, JSON, text formats) and structure parser functions for loading configuration payloads.', tasks: ['CSV', 'JSON', 'TXT', 'File reading', 'File writing', 'JSON parsing'] },
  { dayNumber: 14, phase: p2_de, topic: 'Pandas', description: 'Explore the Pandas library. Learn DataFrames, series selection, grouping aggregates, structural merging, and fill algorithms.', tasks: ['DataFrame', 'read_csv', 'filter', 'groupby', 'merge', 'drop_duplicates', 'fillna'] },
  { dayNumber: 15, phase: p2_de, topic: 'Python + SQL', description: 'Establish programmatic connections to databases (e.g. Oracle, SQLite, Postgres) to query and output table records using Python scripts.', tasks: ['Oracle connection', 'Extract data', 'Transform data', 'Load data'] },
  { dayNumber: 16, phase: p2_de, topic: 'Python ETL', description: 'Construct a complete local ETL pipeline using Python and Pandas. Extract, transform schema, run validations, and write clean outputs.', tasks: ['Extract', 'Transform', 'Validate', 'Load'] },
  { dayNumber: 17, phase: p3_de, topic: 'Spark Fundamentals', description: 'Deconstruct Spark architecture, tracing executions across drivers and executors, and understanding how stages and tasks are organized.', tasks: ['Spark', 'Driver', 'Executor', 'Cluster', 'Jobs', 'Stages', 'Tasks'] },
  { dayNumber: 18, phase: p3_de, topic: 'Spark DataFrames', description: 'Establish standard reads and writes in PySpark, filtering rows, projecting columns, and creating or renaming columns.', tasks: ['read', 'select', 'filter', 'withColumn', 'drop'] },
  { dayNumber: 19, phase: p3_de, topic: 'PySpark Transformations', description: 'Perform advanced column operations using nested conditions (when/otherwise), regex replacement, and string tokenization.', tasks: ['when', 'otherwise', 'cast', 'regexp_replace', 'split'] },
  { dayNumber: 20, phase: p3_de, topic: 'PySpark Joins', description: 'Contrast join strategies in Spark, implementing inner, outer, left, right, and full joins, and watching out for data skew.', tasks: ['Inner join', 'Left join', 'Right join', 'Full join', 'Cross join'] },
  { dayNumber: 21, phase: p3_de, topic: 'PySpark Aggregations', description: 'Learn how to group datasets and write multiple aggregate operations (sums, averages, counts, and custom aliases) across partitions.', tasks: ['groupBy', 'agg', 'count', 'sum', 'avg'] },
  { dayNumber: 22, phase: p3_de, topic: 'PySpark Window Functions', description: 'Perform partition analytics in Spark. Set up window specifications, rank rows, extract lead/lag offsets, and compute running totals.', tasks: ['Window.partitionBy', 'row_number', 'rank', 'deduplication', 'running totals', 'lag', 'lead'] },
  { dayNumber: 23, phase: p3_de, topic: 'PySpark Data Quality', description: 'Translate SQL-based quality checks into scalable PySpark validation actions checking for duplicates, null records, and format issues.', tasks: ['Duplicate detection', 'NULL checks', 'Invalid records', 'Referential checks', 'Business rules'] },
  { dayNumber: 24, phase: p3_de, topic: 'PySpark ETL Project', description: 'Write an end-to-end Python Spark application extracting records, applying schema conversions, executing quality validations, and outputting partition tables.', tasks: ['Oracle extraction', 'PySpark transformation', 'Data validation', 'Output generation'] },
  { dayNumber: 25, phase: p4_de, topic: 'Databricks Fundamentals', description: 'Navigate the Databricks Workspace, creating compute clusters, writing code in shared notebooks, and configuring SQL Warehouses.', tasks: ['Workspace', 'Notebooks', 'Compute', 'Clusters', 'Jobs', 'SQL Warehouse'] },
  { dayNumber: 26, phase: p4_de, topic: 'Databricks + PySpark', description: 'Connect Databricks notebooks to cloud object storage (e.g. DBFS) to fetch, process, and save partitioned datasets.', tasks: ['Run PySpark notebooks', 'Read data', 'Transform data', 'Write data'] },
  { dayNumber: 27, phase: p4_de, topic: 'Delta Lake', description: 'Contrast standard Parquet layouts with Delta format properties. Study ACID transactions, time travel, and schema validations.', tasks: ['Parquet vs Delta', 'ACID transactions', 'Schema enforcement', 'Schema evolution', 'Time travel'] },
  { dayNumber: 28, phase: p4_de, topic: 'Medallion Architecture', description: 'Understand the Medallion pattern: raw ingestion (Bronze), cleansed core records (Silver), and aggregated business models (Gold).', tasks: ['Bronze', 'Silver', 'Gold', 'Data flow design'] },
  { dayNumber: 29, phase: p4_de, topic: 'Bronze Layer', description: 'Create Bronze tables in Delta format, loading raw datasets for Customers, Products, Orders, and Payments with minimal schemas.', tasks: ['Load raw Oracle data', 'Customers', 'Products', 'Orders', 'Payments'] },
  { dayNumber: 30, phase: p4_de, topic: 'Silver Layer', description: 'Design Silver layer tables. Cleanse data by removing duplicates, handling null fields, standardizing strings, and checking keys.', tasks: ['Deduplication', 'NULL handling', 'Invalid records', 'Referential checks', 'Standardization'] },
  { dayNumber: 31, phase: p4_de, topic: 'Gold Layer', description: 'Generate Gold reporting aggregates, building business-ready views of daily revenue, customer purchases, and product sales statistics.', tasks: ['Daily revenue', 'Customer sales', 'Product sales', 'Payment analysis'] },
  { dayNumber: 32, phase: p4_de, topic: 'Delta Optimization', description: 'Maximize query speeds. Study partitioning, Z-Ordering, small file compaction (OPTIMIZE), and table VACUUM logs.', tasks: ['Partitioning', 'OPTIMIZE', 'ZORDER', 'File management', 'Performance'] },
  { dayNumber: 33, phase: p5_de, topic: 'Incremental Pipelines', description: 'Construct stateful incremental pipelines processing only new or updated files, using directory checkpoints and watermark variables.', tasks: ['Initial load', 'Incremental load', 'New records', 'Changed records'] },
  { dayNumber: 34, phase: p5_de, topic: 'MERGE / UPSERT', description: 'Implement Delta Lake MERGE operations to process updates and inserts concurrently in the Silver and Gold layers.', tasks: ['Delta MERGE', 'Insert', 'Update', 'Incremental processing'] },
  { dayNumber: 35, phase: p5_de, topic: 'SCD Type 2 in Databricks', description: 'Track histories dynamically by structuring Delta tables with active flags, start times, and expiration dates during inserts/updates.', tasks: ['Customer history', 'Effective date', 'End date', 'Current flag'] },
  { dayNumber: 36, phase: p5_de, topic: 'Databricks Workflows', description: 'Schedule multi-task notebooks using Databricks Workflows. Link jobs, define execution trees, and configure runtime alerts.', tasks: ['Notebook', 'Task', 'Job', 'Schedule', 'Dependencies'] },
  { dayNumber: 37, phase: p5_de, topic: 'Monitoring & Error Handling', description: 'Set up error routing. Capture pipeline warnings, isolate bad rows into quarantine tables, and dispatch failure alerts.', tasks: ['Pipeline failures', 'Logging', 'Retry', 'Validation', 'Bad records', 'Alerts'] },
  { dayNumber: 38, phase: p6_de, topic: 'Setup & Bronze Ingestion', description: 'Day 1 of the portfolio project. Set up the raw retail dataset (100K+ orders, customers, products, payments), establish connections, and implement the Bronze ingestion layer.', tasks: ['Generate 100K+ synthetic orders', 'Establish connection to Databricks Workspace', 'Develop Bronze ingestion pipeline', 'Verify raw data counts'] },
  { dayNumber: 39, phase: p6_de, topic: 'Data Quality & Silver Cleansing', description: 'Day 2 of the portfolio project. Design schema validation, remove duplicates, handle missing values, and transform Bronze data into the Silver layer.', tasks: ['Implement duplicate detection', 'Configure Null validation quarantine', 'Perform data-type standardization', 'Build Silver layer Delta tables'] },
  { dayNumber: 40, phase: p6_de, topic: 'SCD Type 2 & Incremental Loads', description: 'Day 3 of the portfolio project. Develop incremental load paths using watermarking and implement historical customer tracking via Slowly Changing Dimensions (SCD Type 2).', tasks: ['Build watermark logic', 'Write Delta MERGE upsert queries', 'Develop SCD Type 2 pipeline', 'Validate history retention'] },
  { dayNumber: 41, phase: p6_de, topic: 'Gold Analytics & Workflow Jobs', description: 'Day 4 of the portfolio project. Construct aggregate business reporting tables in the Gold layer and orchestrate the full pipeline using Databricks Workflows.', tasks: ['Write Gold transformations for revenue', 'Perform product affinity aggregations', 'Assemble pipeline into a Databricks Job', 'Configure cron schedules & alerts'] },
  { dayNumber: 42, phase: p7_de, topic: 'SQL Interview Preparation', description: 'Work through complex mock interview problems on window functions, recursive joins, query optimizations, and data quality check queries.', tasks: ['Solve 50+ intermediate/advanced SQL queries', 'Solve top-N records window queries', 'Solve database explain plan challenges', 'Explain referential constraints'] },
  { dayNumber: 43, phase: p7_de, topic: 'PySpark Interview Preparation', description: 'Master questions detailing Spark cluster structure, partitioning, caching rules, broad-join optimizations, and DAG stage divisions.', tasks: ['Explain Catalyst optimizer', 'Review narrow vs wide transformations', 'Detail caching policies', 'Solve PySpark window analytical exercises'] },
  { dayNumber: 44, phase: p7_de, topic: 'Databricks Interview Preparation', description: 'Prepare responses regarding Delta table internals, Medallion structure advantages, and incremental load implementations.', tasks: ['Explain Delta transaction logs', 'Explain schema enforcement vs evolution', 'Detail Medallion architecture advantages', 'Explain how incremental watermarks track changes'] },
  { dayNumber: 45, phase: p7_de, topic: 'Mock Interview + Resume Finalization', description: 'Refine your professional data engineering resume, structure your project narratives, and perform mock interviews.', tasks: ['Draft and review Data Engineer resume', 'Formulate project summaries in STAR format', 'Practice systems design explanations', 'Prepare for salary negotiations'] }
];

// Load Full Stack Roadmap
const fsRoadmap = [
  { dayNumber: 1, phase: p1_fs, topic: 'HTML5 Semantic Web', description: 'Learn to structure web pages using semantic HTML elements to improve SEO and accessibility.', tasks: ['Semantic tags (header, section, article, footer)', 'Form validations and attributes', 'SEO meta tags', 'Web accessibility standards (WCAG)'] },
  { dayNumber: 2, phase: p1_fs, topic: 'CSS Modern Layouts: Flexbox', description: 'Master one-dimensional layouts using CSS Flexbox. Learn alignments, directions, and responsiveness.', tasks: ['flex-direction & alignment (justify-content, align-items)', 'flex-grow, flex-shrink, flex-basis', 'Responsive flex layouts', 'Flex gaps and nesting'] },
  { dayNumber: 3, phase: p1_fs, topic: 'CSS Modern Layouts: Grid', description: 'Master two-dimensional layouts using CSS Grid. Learn grid tracks, templates, areas, and alignments.', tasks: ['grid-template-columns & grid-template-rows', 'grid-template-areas', 'minmax and autofit/autofill', 'Responsive grid grids'] },
  { dayNumber: 4, phase: p1_fs, topic: 'Advanced CSS & Responsive design', description: 'Explore media queries, variables, transitions, transforms, and fluid grids to make pages look premium.', tasks: ['CSS variables', 'Media queries & breakpoints', 'CSS animations and keyframes', 'Transitions & transforms'] },
  { dayNumber: 5, phase: p1_fs, topic: 'JavaScript Foundations: Variables & Scope', description: 'Review modern JS variables, execution contexts, variable shadowing, closures, and scoping.', tasks: ['let vs const vs var', 'Block scope vs function scope', 'JS Engine & Call Stack', 'Closures and lexical scoping'] },
  { dayNumber: 6, phase: p1_fs, topic: 'JavaScript Arrays & Reference Types', description: 'Understand JS collections, objects, arrays, and standard higher-order functional methods.', tasks: ['Array mapping (map, filter, reduce)', 'Array mutators vs non-mutators', 'Spread/rest operators', 'Destructuring assignments'] },
  { dayNumber: 7, phase: p1_fs, topic: 'JavaScript Async Programing: Promises', description: 'Learn asynchronous JS loop behavior. Master Promises, resolve/reject pathways, and chaining.', tasks: ['Callback hell', 'Promise constructor', 'Promise.then() and catch()', 'Promise.all() & Promise.race()'] },
  { dayNumber: 8, phase: p1_fs, topic: 'JavaScript Async Programing: Async/Await', description: 'Learn to write clean async code using async/await syntax and error-handling blocks.', tasks: ['async keyword', 'await keyword', 'try/catch block error handling', 'Fetch API basics'] },
  { dayNumber: 9, phase: p1_fs, topic: 'JavaScript DOM Manipulation', description: 'Interact with and manipulate the HTML document object model programmatically using JavaScript.', tasks: ['document.querySelector', 'Event listeners', 'Creating & inserting DOM elements', 'Event delegation & bubbling'] },
  { dayNumber: 10, phase: p1_fs, topic: 'JS API Integration', description: 'Fetch data from REST endpoints, handle response payloads, render lists dynamically, and manage loading states.', tasks: ['Get requests with Fetch', 'Post JSON requests', 'Loading indicators', 'Dynamic HTML list rendering'] },
  { dayNumber: 11, phase: p2_fs, topic: 'Git Version Control Basics', description: 'Start tracking project versions. Understand staging, commits, branches, and logs.', tasks: ['git init & git clone', 'git add & git commit', 'git status & git log', 'git branch & git checkout'] },
  { dayNumber: 12, phase: p2_fs, topic: 'Git Collaborations: GitHub & Merges', description: 'Learn how to resolve merge conflicts, handle pull requests, push to GitHub, and manage remotes.', tasks: ['git remote add', 'git push & git pull', 'PR reviews', 'Conflict resolutions'] },
  { dayNumber: 13, phase: p2_fs, topic: 'Node Package Manager (NPM)', description: 'Understand package management in JS projects. Learn dependencies, scripts, and semantic versioning.', tasks: ['npm init', 'package.json vs package-lock.json', 'dependencies vs devDependencies', 'NPM scripts'] },
  { dayNumber: 14, phase: p2_fs, topic: 'Frontend Bundlers (Vite)', description: 'Set up modern bundlers. Learn how Vite hot module replacement (HMR) and assets packaging compile frontend structures.', tasks: ['Vite templates creation', 'HMR mechanics', 'Static asset folder configuration', 'Product building'] },
  { dayNumber: 15, phase: p2_fs, topic: 'Linters & Formatters', description: 'Set up ESLint and Prettier to automatically maintain clean, uniform code styles across team repositories.', tasks: ['ESLint setup', 'Prettier config rules', 'Lint staging', 'Auto format on save'] },
  { dayNumber: 16, phase: p3_fs, topic: 'React.js Core: Components', description: 'Deconstruct React architecture. Learn JSX, functional components, and unidirectional data flow.', tasks: ['JSX syntax rules', 'Functional components creation', 'Props passing', 'Conditional rendering'] },
  { dayNumber: 17, phase: p3_fs, topic: 'React.js Core: State (useState)', description: 'Manage local component memory using the useState Hook. Learn how rendering updates state values.', tasks: ['useState hook', 'State immutability', 'Form controls binding', 'State hoisting'] },
  { dayNumber: 18, phase: p3_fs, topic: 'React.js Core: Lifecycle (useEffect)', description: 'Sync components with APIs. Learn the useEffect hook, dependency arrays, and cleanup callbacks.', tasks: ['useEffect hook', 'Dependency array rules', 'API fetches inside useEffect', 'Event listener cleanup'] },
  { dayNumber: 19, phase: p3_fs, topic: 'React Lists & Keys', description: 'Render arrays of objects inside React. Learn list indexing, unique key requirements, and component map loops.', tasks: ['Rendering mapping arrays', 'Key attributes rules', 'Filter lists', 'Sort components'] },
  { dayNumber: 20, phase: p3_fs, topic: 'React Hooks: useContext', description: 'Share global variables across component trees without prop-drilling, using Context providers.', tasks: ['React.createContext', 'Context.Provider', 'useContext hook', 'State sharing'] },
  { dayNumber: 21, phase: p3_fs, topic: 'React Hooks: useRef & useMemo', description: 'Access DOM elements directly, store mutable variables, and cache expensive computations.', tasks: ['useRef hook', 'useMemo caching', 'DOM reference binds', 'Performance optimizations'] },
  { dayNumber: 22, phase: p3_fs, topic: 'React Custom Hooks', description: 'Extract repetitive component behaviors (such as data fetching or form handling) into reusable hooks.', tasks: ['Create custom hooks', 'Fetch hooks creation', 'Form handling hooks', 'State share rules'] },
  { dayNumber: 23, phase: p3_fs, topic: 'React Router', description: 'Enable single page application routing. Learn route routes, parameters, links, and navigations.', tasks: ['BrowserRouter setup', 'Routes & Route configurations', 'Link vs NavLink', 'useNavigate & useParams'] },
  { dayNumber: 24, phase: p3_fs, topic: 'React UI Styling: Ant Design', description: 'Build premium responsive layouts using Antd. Study grid, buttons, forms, tables, and themes.', tasks: ['Antd ConfigProvider', 'Antd Forms & Inputs', 'Antd Table column headers', 'Antd theme tokens overrides'] },
  { dayNumber: 25, phase: p3_fs, topic: 'React State Management (Redux Toolkit)', description: 'Explore complex state management. Set up RTK store, slices, selectors, and dispatch actions.', tasks: ['configureStore', 'createSlice', 'useSelector & useDispatch', 'Async thunks'] },
  { dayNumber: 26, phase: p4_fs, topic: 'Node.js Core', description: 'Study Node.js runtime system, event loop, file operations, standard paths, and module types.', tasks: ['CommonJS vs ESM modules', 'FS module operations', 'Path module', 'Process variables'] },
  { dayNumber: 27, phase: p4_fs, topic: 'Express.js Foundations', description: 'Set up Express server, write basic route handlers, and parse JSON body payloads.', tasks: ['express() initialization', 'app.listen and port bindings', 'GET/POST controllers', 'res.json and res.send'] },
  { dayNumber: 28, phase: p4_fs, topic: 'Express Routing & Middleware', description: 'Structure routes into clean sub-modules using Express Router. Master custom middleware executions.', tasks: ['express.Router', 'Application-level middleware', 'Route-level middleware', 'Error-handling middleware'] },
  { dayNumber: 29, phase: p4_fs, topic: 'REST API Design Rules', description: 'Learn standard URI naming structures, HTTP response codes, and payload formatting best practices.', tasks: ['Endpoint mappings', 'HTTP status codes', 'JSON error templates', 'Request query parsing'] },
  { dayNumber: 30, phase: p4_fs, topic: 'Express Error Handling', description: 'Implement unified try/catch error routes and global error interceptor middleware.', tasks: ['Global error handler middleware', 'Custom Error classes', 'Async routing wrappers', '404 route handling'] },
  { dayNumber: 31, phase: p5_fs, topic: 'Database Concepts: SQL vs NoSQL', description: 'Contrast schema-oriented relational tables against flexible document-store structures.', tasks: ['Relational database characteristics', 'NoSQL document stores attributes', 'ACID guarantees comparison', 'Database choose paradigms'] },
  { dayNumber: 32, phase: p5_fs, topic: 'SQL Basics: PostgreSQL', description: 'Install PostgreSQL, create tables, specify column data types, write basic JOIN queries, and specify keys.', tasks: ['CREATE TABLE schemas', 'SQL INSERT/UPDATE queries', 'JOIN select statements', 'Where filtering'] },
  { dayNumber: 33, phase: p5_fs, topic: 'NoSQL Basics: MongoDB', description: 'Install MongoDB locally or connect to Atlas. Learn collections, documents, and CRUD query functions.', tasks: ['MongoDB documents structure', 'insertOne & insertMany', 'find filtering queries', 'update/delete query blocks'] },
  { dayNumber: 34, phase: p5_fs, topic: 'Mongoose Schemas & Models', description: 'Declare Mongoose schemas on the backend, define schema validation rules, and compile models.', tasks: ['mongoose.Schema definitions', 'Validation rules config', 'mongoose.model compilations', 'Mongoose timestamps'] },
  { dayNumber: 35, phase: p5_fs, topic: 'Mongoose CRUD Operations', description: 'Retrieve and manipulate database records. Use find, findOne, findByIdAndUpdate, and delete commands.', tasks: ['Model.find() options', 'Model.create() actions', 'findByIdAndUpdate updates', 'Model.deleteOne() deletes'] },
  { dayNumber: 36, phase: p6_fs, topic: 'Password Hashing (Bcrypt)', description: 'Secure user database passwords. Understand salt factors and write pre-save hash middleware.', tasks: ['bcrypt.genSalt', 'bcrypt.hash', 'bcrypt.compare', 'Mongoose pre-save hooks'] },
  { dayNumber: 37, phase: p6_fs, topic: 'JWT Authentication Mechanics', description: 'Implement token authorization. Learn signature creation, token expiration, and auth header check.', tasks: ['jwt.sign payload encoding', 'Authorization headers parse', 'jwt.verify validations', 'Token expiration settings'] },
  { dayNumber: 38, phase: p6_fs, topic: 'CORS & Security Headers', description: 'Protect your API. Configure CORS whitelist parameters and load Helmet secure headers.', tasks: ['CORS origin whitelists', 'CORS preflight checks', 'Helmet middleware integration', 'XSS protections'] },
  { dayNumber: 39, phase: p6_fs, topic: 'Request Validation (Joi/Zod)', description: 'Validate incoming request body payloads using schema validation libraries before executing database queries.', tasks: ['Zod schema definitions', 'Express validation middleware', 'Body parse error catch', 'Safe schema validation'] },
  { dayNumber: 40, phase: p6_fs, topic: 'File Uploads (Multer)', description: 'Support file upload actions. Configure local folder uploads, file filters, and size constraints.', tasks: ['multer storage configs', 'File filter options', 'Multipart parser middleware', 'Local path responses'] },
  { dayNumber: 41, phase: p7_fs, topic: 'Backend Unit Testing (Jest)', description: 'Configure Jest. Write unit tests verifying controller return payloads and mock services.', tasks: ['Jest install & setup', 'test() assertions', 'describe() test blocks', 'Mock service calls'] },
  { dayNumber: 42, phase: p7_fs, topic: 'API Integration Testing (Supertest)', description: 'Perform end-to-end integration tests of Express REST routes. Verify endpoints return correct JSON formats and HTTP codes.', tasks: ['Supertest configuration', 'Request route assertions', 'Database seed test sets', 'Clean environment teardown'] },
  { dayNumber: 43, phase: p7_fs, topic: 'Docker Containers', description: 'Package Node projects into Docker containers. Write Dockerfile configurations and ignore rules.', tasks: ['Write node Dockerfile', 'Build docker images', 'Run docker container ports', '.dockerignore configurations'] },
  { dayNumber: 44, phase: p7_fs, topic: 'CI/CD Pipelines (GitHub Actions)', description: 'Configure continuous integration pipelines. Set up build checkers and automatic test runners on git pushes.', tasks: ['.github/workflows yaml configuration', 'Node build checks setup', 'Environment variables injections', 'CI validation runs'] },
  { dayNumber: 45, phase: p7_fs, topic: 'Production Cloud Deployment (Render)', description: 'Deploy full stack systems. Link repositories, configure environment variables, and manage build deployments.', tasks: ['Render server configuration', 'Atlas database whitelist rules', 'Render static site compile', 'Live testing checks'] }
];

// Load Java Developer Roadmap
const javaRoadmap = [
  { dayNumber: 1, phase: p1_jv, topic: 'Java Development Kit Setup', description: 'Install OpenJDK, configure system environment variables, and write your first Hello World Java program.', tasks: ['Install JDK 17/21', 'Configure JAVA_HOME', 'Write compile javac command', 'Run java class output'] },
  { dayNumber: 2, phase: p1_jv, topic: 'Java Variables & Primitive Types', description: 'Examine Java variables and primitive types: byte, short, int, long, float, double, char, boolean.', tasks: ['Primitive variables', 'Type casting (implicit & explicit)', 'Variable declarations rules', 'Constant final variables'] },
  { dayNumber: 3, phase: p1_jv, topic: 'Control Flow: Conditionals', description: 'Write conditional execution blocks using if-else statements and switch expressions in Java.', tasks: ['if-else conditional chains', 'Ternary operator syntax', 'Switch case match logic', 'Modern switch expressions'] },
  { dayNumber: 4, phase: p1_jv, topic: 'Control Flow: Iterations', description: 'Write loop structures using for, while, and do-while loops in Java.', tasks: ['For loop counters', 'While loop boundaries', 'Do-while execution guarantees', 'Break & Continue commands'] },
  { dayNumber: 5, phase: p1_jv, topic: 'Arrays in Java', description: 'Understand one-dimensional and multi-dimensional arrays, index boundaries, and loop iterations.', tasks: ['Declare and instantiate arrays', 'Loop arrays (enhanced for loop)', 'Multi-dimensional arrays access', 'java.util.Arrays utilities'] },
  { dayNumber: 6, phase: p1_jv, topic: 'String Handling in Java', description: 'Master Strings in Java. Learn String Pool, immutability, and StringBuilder optimizations.', tasks: ['String literals vs constructor objects', 'String pool mechanics', 'Immutability concept', 'StringBuilder vs StringBuffer'] },
  { dayNumber: 7, phase: p1_jv, topic: 'Methods & Recursion', description: 'Write Java methods. Study access modifiers, parameter passing, return types, and recursion.', tasks: ['Method signature rules', 'Pass-by-value properties', 'Method overloading options', 'Recursion exits'] },
  { dayNumber: 8, phase: p2_jv, topic: 'Java OOP: Classes & Objects', description: 'Understand OOP. Define classes, instance fields, standard constructors, and create objects.', tasks: ['Class structure rules', 'Instance fields vs local variables', 'No-arg vs parameterized constructors', 'new operator allocations'] },
  { dayNumber: 9, phase: p2_jv, topic: 'Java OOP: Encapsulation & Inheritance', description: 'Examine encapsulation using getters/setters and inherit properties using the extends keyword.', tasks: ['Private variables access', 'Getter and Setter patterns', 'extends keyword inheritance', 'super constructor delegation'] },
  { dayNumber: 10, phase: p2_jv, topic: 'Java OOP: Polymorphism', description: 'Understand compile-time and runtime polymorphism in Java. Learn overriding rules and super calls.', tasks: ['Method overloading (compile-time)', 'Method overriding (runtime)', '@Override annotation rules', 'Dynamic method dispatch'] },
  { dayNumber: 11, phase: p2_jv, topic: 'Java OOP: Abstraction & Interfaces', description: 'Study abstraction. Write abstract classes and implement interface contracts in Java.', tasks: ['Abstract classes creation', 'Interface definitions rules', 'implements keyword actions', 'Multiple interfaces support'] },
  { dayNumber: 12, phase: p2_jv, topic: 'Java OOP: Packages & Access Modifiers', description: 'Organize files using Java packages. Master access modifiers: public, protected, private, and default.', tasks: ['package folders namespace', 'public vs private keywords', 'protected class accesses', 'Default (package-private) rules'] },
  { dayNumber: 13, phase: p3_jv, topic: 'Java Collections Framework Overview', description: 'Understand collection structures. Compare Collection interfaces: List, Set, Queue, and Map.', tasks: ['Collections Framework hierarchy', 'ArrayList vs LinkedList', 'HashSet vs TreeSet', 'HashMap vs TreeMap'] },
  { dayNumber: 14, phase: p3_jv, topic: 'Java Collections: ArrayList & LinkedList', description: 'Examine List behaviors: indexing, dynamic resizing, insert/delete times, and iterator loops.', tasks: ['ArrayList dynamic arrays', 'LinkedList linked nodes', 'List iterations (Iterator, ListIterator)', 'Collections.sort() usage'] },
  { dayNumber: 15, phase: p3_jv, topic: 'Java Collections: Set & Map', description: 'Master unique collections and key-value associations. Use HashSet, TreeSet, HashMap, and TreeMap.', tasks: ['HashSet unique checks', 'TreeSet ordering sorting', 'HashMap key-value matching', 'Iterate Map (entrySet, keySet)'] },
  { dayNumber: 16, phase: p3_jv, topic: 'Java Generics', description: 'Implement type-safe collections. Write generic classes, methods, and understand wildcards.', tasks: ['Generic class parameters', 'Generic methods template', 'Wildcards (? extends T, ? super T)', 'Type erasure concepts'] },
  { dayNumber: 17, phase: p4_jv, topic: 'Java Exception Handling: Basics', description: 'Learn try-catch exception handling. Contrast Checked vs Unchecked exceptions.', tasks: ['try-catch block actions', 'Checked exceptions definitions', 'Unchecked (Runtime) exceptions', 'throw vs throws keywords'] },
  { dayNumber: 18, phase: p4_jv, topic: 'Java Exception Handling: Advanced', description: 'Write custom exceptions. Master finally blocks and Try-With-Resources resource cleanup.', tasks: ['Custom Exception classes', 'finally execution rules', 'AutoCloseable interfaces', 'Try-With-Resources structures'] },
  { dayNumber: 19, phase: p4_jv, topic: 'Java Lambda Expressions', description: 'Learn functional programming in Java. Master Functional Interfaces and Lambda syntax.', tasks: ['Functional Interface definition', '@FunctionalInterface validation', 'Lambda arrow parameters', 'java.util.function package (Predicate, Consumer)'] },
  { dayNumber: 20, phase: p4_jv, topic: 'Java Streams API: Basics', description: 'Perform pipeline calculations on collections. Use filter, map, and collect commands.', tasks: ['Stream source creation', 'Intermediate operations (filter, map)', 'Terminal operations (collect, forEach)', 'Streams lazy evaluation'] },
  { dayNumber: 21, phase: p4_jv, topic: 'Java Streams API: Advanced', description: 'Master advanced reductions. Use reduce, flatMap, groupingBy, and optional sorting.', tasks: ['Reduce accumulations', 'flatMap list flattening', 'Collectors.groupingBy classifications', 'Optional class handling'] },
  { dayNumber: 22, phase: p4_jv, topic: 'Java File I/O (NIO)', description: 'Read and write local files. Learn Files, Paths, and Buffer streams in Java.', tasks: ['java.nio.file.Paths & Files', 'BufferedReader & BufferedWriter', 'File write validations', 'Directory listings'] },
  { dayNumber: 23, phase: p4_jv, topic: 'Java Multithreading: Basics', description: 'Study concurrency. Learn Thread class lifecycle, Runnable interface, and start actions.', tasks: ['Thread class inheritance', 'Runnable interface implementations', 'Thread lifecycle states', 'Thread.sleep() & join()'] },
  { dayNumber: 24, phase: p4_jv, topic: 'Java Multithreading: Synchronization', description: 'Protect shared state. Study synchronized blocks, locks, and thread-safe collections.', tasks: ['synchronized method modifiers', 'synchronized(this) block binds', 'ReentrantLock concurrency controls', 'ConcurrentHashMap usage'] },
  { dayNumber: 25, phase: p5_jv, topic: 'Maven Build Tool', description: 'Understand Java build lifecycle. Declare project configurations inside `pom.xml` files.', tasks: ['pom.xml specifications', 'Maven dependency manager', 'Maven plugins configuration', 'mvn clean package builds'] },
  { dayNumber: 26, phase: p5_jv, topic: 'Java Database Connectivity (JDBC)', description: 'Connect Java programs to SQL databases. Execute SQL queries using Statement and PreparedStatement.', tasks: ['DriverManager connection config', 'PreparedStatement parameters', 'ResultSet loop processing', 'Close connections resources'] },
  { dayNumber: 27, phase: p5_jv, topic: 'Java Connection Pooling (HikariCP)', description: 'Optimize database connections. Configure Hikari Connection Pool properties.', tasks: ['HikariCP dependencies loading', 'HikariConfig specifications', 'HikariDataSource pools', 'Connection recycle tests'] },
  { dayNumber: 28, phase: p6_jv, topic: 'Spring Framework: Core Concepts', description: 'Study Spring IoC. Learn ApplicationContext, Dependency Injection, and Bean configurations.', tasks: ['Inversion of Control concepts', 'Dependency Injection paradigms', '@Component & @Autowired annotations', 'Spring ApplicationContext container'] },
  { dayNumber: 29, phase: p6_jv, topic: 'Spring Bean Lifecycles', description: 'Configure bean scope behaviors: Singleton, Prototype, Init/Destroy lifecycle hooks.', tasks: ['Singleton vs Prototype scope', '@Scope annotation', 'PostConstruct & PreDestroy hooks', 'Custom Bean definitions'] },
  { dayNumber: 30, phase: p6_jv, topic: 'Spring Boot Foundations', description: 'Create Spring Boot applications. Master auto-configuration and start configurations.', tasks: ['Spring Boot Starters', '@SpringBootApplication setup', 'application.properties variables', 'Boot run commands'] },
  { dayNumber: 31, phase: p6_jv, topic: 'Spring Boot Database: Spring Data JPA', description: 'Connect Spring Boot to database using Hibernate ORM. Declare Entity models.', tasks: ['@Entity schema mapping annotations', '@Id primary key configurations', 'Spring Data JpaRepository', 'Database auto-creation configs'] },
  { dayNumber: 32, phase: p6_jv, topic: 'Spring Data JPA Relationships', description: 'Implement relationship mappings in Hibernate: OneToMany, ManyToOne, ManyToMany.', tasks: ['@OneToMany list bindings', '@ManyToOne join columns', '@ManyToMany mapping tables', 'FetchType Lazy vs Eager'] },
  { dayNumber: 33, phase: p6_jv, topic: 'Spring Data JPA Queries', description: 'Query JPA databases. Study derived query methods, JPQL, and Native SQL queries.', tasks: ['Derived query method signatures', '@Query JPQL queries', '@Query nativeQuery option', 'Pagination & Sort params'] },
  { dayNumber: 34, phase: p6_jv, topic: 'Spring Transaction Management', description: 'Configure database transaction boundaries using Spring `@Transactional` annotation.', tasks: ['@Transactional annotations', 'Rollback exception rules', 'Transaction propagation types', 'Isolation level configurations'] },
  { dayNumber: 35, phase: p7_jv, topic: 'Spring Web: REST Controller', description: 'Build REST endpoints. Map requests, parse JSON bodies, and send responses.', tasks: ['@RestController annotations', '@GetMapping & @PostMapping mapping', '@PathVariable & @RequestParam parse', 'ResponseEntity custom responses'] },
  { dayNumber: 36, phase: p7_jv, topic: 'Spring Web: Request Validation', description: 'Validate incoming controller payload fields using standard validation annotations.', tasks: ['@Valid validations', '@NotNull & @Size constraints', 'BindingResult errors mapping', 'ExceptionHandler handling custom errors'] },
  { dayNumber: 37, phase: p7_jv, topic: 'Spring Web: Exception Handling', description: 'Implement global controller error handlers using `@ControllerAdvice` and `@ExceptionHandler`.', tasks: ['@ControllerAdvice handler classes', '@ExceptionHandler exceptions capture', 'Custom error JSON bodies', 'HTTP status mappings'] },
  { dayNumber: 38, phase: p7_jv, topic: 'Spring Security: Web Security Config', description: 'Secure REST routes. Write SecurityFilterChain configurations and protect endpoints.', tasks: ['SecurityFilterChain bean definitions', 'authorizeHttpRequests rules', 'httpBasic vs formLogin', 'CSRF disable config'] },
  { dayNumber: 39, phase: p7_jv, topic: 'Spring Security: JWT Auth', description: 'Secure controllers using JSON Web Tokens. Write JWT filter interceptor filters.', tasks: ['JWT generator beans', 'OncePerRequestFilter interceptors', 'UsernamePasswordAuthenticationToken', 'SecurityContextHolder sets'] },
  { dayNumber: 40, phase: p7_jv, topic: 'Java Unit Testing (JUnit 5)', description: 'Write unit tests in Java. Master assertions, test executions, and lifecycle annotations.', tasks: ['JUnit 5 dependencies setup', '@Test assertion targets', '@BeforeEach & @AfterEach hooks', 'assertNotNull & assertEquals'] },
  { dayNumber: 41, phase: p7_jv, topic: 'Mockito Mocking Framework', description: 'Isolate Java classes for unit tests. Write mocks and verify service methods calls.', tasks: ['MockitoAnnotations mock setups', '@Mock & @InjectMocks annotations', 'Mockito.when() stub behaviors', 'Mockito.verify() assertions'] },
  { dayNumber: 42, phase: p7_jv, topic: 'Spring Boot Integration Testing', description: 'Run full-context Spring Boot integration tests. Use `@SpringBootTest` and MockMvc.', tasks: ['@SpringBootTest context load', '@AutoConfigureMockMvc configs', 'MockMvc HTTP request tests', 'Test database parameters'] },
  { dayNumber: 43, phase: p7_jv, topic: 'Microservices Architecture Concepts', description: 'Deconstruct microservices: service discovery, API gateways, load balancing, config servers.', tasks: ['Monolithic vs Microservice architecture', 'Service Registry (Netflix Eureka)', 'API Gateways (Spring Cloud Gateway)', 'Client-side load balancer'] },
  { dayNumber: 44, phase: p7_jv, topic: 'Dockerizing Java Applications', description: 'Write multi-stage Dockerfiles compiling and packaging Spring Boot JARs into clean containers.', tasks: ['Java multi-stage Dockerfile', 'Build Spring Boot JAR container', 'Run docker container ports', 'Docker logs check'] },
  { dayNumber: 45, phase: p7_jv, topic: 'Production Cloud Deployment (Render VM)', description: 'Deploy Java applications. Configure JAR compile processes, deploy backend web services, and check logs.', tasks: ['Configure Render custom runtime', 'Compile mvn clean package Render', 'Atlas database connections check', 'Email notification tests'] }
];

// Load Flutter Developer Roadmap
const flutterRoadmap = [
  { dayNumber: 1, phase: p1_fl, topic: 'Dart Programming: Basics', description: 'Install Dart SDK, execute your first script, and learn variables, type inference, and primitives.', tasks: ['Install Dart SDK', 'Variables & var keyword', 'Object type checks', 'dart run execution'] },
  { dayNumber: 2, phase: p1_fl, topic: 'Dart Control Flow & Functions', description: 'Write Dart conditional paths, standard loops, variable arguments, optional parameters, and arrow functions.', tasks: ['if-else statements', 'for & while loops', 'Optional positional params', 'Arrow function shorthand'] },
  { dayNumber: 3, phase: p1_fl, topic: 'Dart OOP: Classes & Constructors', description: 'Implement OOP in Dart. Write class instances, custom parameters constructors, and named constructors.', tasks: ['Class variables definitions', 'Standard constructors params', 'Named constructors', 'Initializer lists'] },
  { dayNumber: 4, phase: p1_fl, topic: 'Dart OOP: Inheritance & Mixins', description: 'Study extensions. Learn inheritance extends overrides, abstract classes, interface contracts, and Dart mixins.', tasks: ['extends inheritance overrides', 'Abstract classes interfaces', 'Mixin keyword syntax', 'with mixin attachments'] },
  { dayNumber: 5, phase: p1_fl, topic: 'Dart Collections', description: 'Master Dart collections framework. Learn List properties, Set unique rules, Map pairs, and higher-order mapping.', tasks: ['List additions mapping', 'Set unique filtering', 'Map key-value lookups', 'Spread operators in collections'] },
  { dayNumber: 6, phase: p1_fl, topic: 'Dart Null Safety', description: 'Understand Sound Null Safety. Learn nullable variables, null assertions, and late initialization variables.', tasks: ['Nullable types (?)', 'Null assertion operator (!)', 'Null-aware operators (??, ?.)', 'late variables usage'] },
  { dayNumber: 7, phase: p1_fl, topic: 'Dart Async: Futures', description: 'Perform async calculations in Dart. Understand Futures, async/await pathways, and try/catch exceptions.', tasks: ['Future constructors', 'async / await commands', 'Future.then() catchError()', 'Delay task timers'] },
  { dayNumber: 8, phase: p1_fl, topic: 'Dart Async: Streams', description: 'Examine reactive streams. Write stream controllers, yield generators, and listen to stream broadcasts.', tasks: ['StreamController streams', 'Stream yield* generators', 'listen() subscription hooks', 'StreamBuilder concept preview'] },
  { dayNumber: 9, phase: p2_fl, topic: 'Flutter SDK Installation', description: 'Install Flutter SDK, configure IDE bindings (VS Code / Android Studio), and run the flutter doctor validator.', tasks: ['Download Flutter SDK', 'PATH env configurations', 'Run flutter doctor', 'Configure simulator/emulator'] },
  { dayNumber: 10, phase: p2_fl, topic: 'Flutter App Anatomy', description: 'Deconstruct a Flutter project skeleton. Understand pubspec.yaml, main.dart, and the runApp entry point.', tasks: ['pubspec.yaml dependency manager', 'main() runApp entry point', 'MaterialApp scaffold basics', 'Hot reload vs Hot restart'] },
  { dayNumber: 11, phase: p2_fl, topic: 'Widgets: Stateless vs Stateful', description: 'Study Widget tree states. Contrast static UI displays with mutable State controllers.', tasks: ['StatelessWidget components', 'StatefulWidget controllers', 'setState() trigger re-render', 'State lifecycle methods (initState, dispose)'] },
  { dayNumber: 12, phase: p2_fl, topic: 'Core Layout Widgets: Container & Flex', description: 'Write basic box layouts using Container styling, Padding, Row, Column, and Flex spacing.', tasks: ['Container box decoration configs', 'Row & Column layouts', 'MainAxisAlignment & CrossAxisAlignment', 'Expanded & Flexible variables'] },
  { dayNumber: 13, phase: p2_fl, topic: 'Core Layout Widgets: Stack & Positioned', description: 'Master overlapping layout patterns using Stack, Positioned, and Align widgets.', tasks: ['Stack alignments', 'Positioned layouts offsets', 'Align widget positions', 'IndexedStack index swaps'] },
  { dayNumber: 14, phase: p2_fl, topic: 'User Inputs: Buttons & TextFields', description: 'Capture form inputs. Write TextFields, InputDecoration borders, ElevatedButtons, and handle text controllers.', tasks: ['TextEditingController binding', 'TextField decoration configs', 'ElevatedButton & TextButton clicks', 'Form validation validator check'] },
  { dayNumber: 15, phase: p3_fl, topic: 'Scrollable Views: ListView', description: 'Display lists of widgets using ListView, ListView.builder, and handle list item builders.', tasks: ['ListView static layout list', 'ListView.builder dynamic lists', 'ListTile list components', 'Physics scroll controls'] },
  { dayNumber: 16, phase: p3_fl, topic: 'Scrollable Views: GridView', description: 'Create dynamic layout grids. Master GridView, GridView.builder, and configure grid delegates.', tasks: ['GridView.count static grid cell', 'GridView.builder dynamic layouts', 'SliverGridDelegateWithFixedCrossAxisCount', 'Grid aspect ratio settings'] },
  { dayNumber: 17, phase: p3_fl, topic: 'Images & Assets Handling', description: 'Load local assets. Define image assets paths inside pubspec.yaml, and fetch Network images.', tasks: ['pubspec.yaml assets config', 'Image.asset local loaders', 'Image.network URL fetches', 'CachedNetworkImage implementation'] },
  { dayNumber: 18, phase: p3_fl, topic: 'Custom App Styling: Theme & Fonts', description: 'Brand your Flutter app. Configure global ThemeData, Custom Fonts, and Dark Mode settings.', tasks: ['ThemeData colors settings', 'Custom Fonts assets imports', 'Theme.of(context) style lookups', 'DarkMode brightness switches'] },
  { dayNumber: 19, phase: p3_fl, topic: 'Custom Painters & Canvas', description: 'Draw custom vector structures on screen using CustomPainter, Paint tools, and Canvas boundaries.', tasks: ['CustomPainter override paths', 'Canvas drawCircle drawPath', 'Paint color stroke widths', 'ShouldRepaint optimization rules'] },
  { dayNumber: 20, phase: p4_fl, topic: 'Flutter Navigation: Navigator 1.0', description: 'Understand push/pop routing pathways. Learn Navigator 1.0, named routes, and page pops.', tasks: ['Navigator.push PageRouteBuilder', 'Navigator.pop navigation return', 'MaterialPageRoute configurations', 'onGenerateRoute routing maps'] },
  { dayNumber: 21, phase: p4_fl, topic: 'Flutter Navigation: GoRouter (Navigator 2.0)', description: 'Implement declarative url routing in Flutter using GoRouter package. Map route arguments.', tasks: ['GoRouter config initialization', 'GoRoute path definition mappings', 'context.go() redirection path', 'Passing route parameters'] },
  { dayNumber: 22, phase: p4_fl, topic: 'Flutter Navigation: TabBar & Drawer', description: 'Implement primary app layouts: TabBar navigation, TabBarView panels, and Drawer slide-outs.', tasks: ['TabController bindings', 'TabBarView page displays', 'Scaffold drawer side panels', 'Navigation drawer clicks'] },
  { dayNumber: 23, phase: p4_fl, topic: 'Flutter Dialogs & BottomSheets', description: 'Display overlay components. Write AlertDialogs, SnackBars notifications, and showModalBottomSheet Panels.', tasks: ['showDialog AlertDialog layouts', 'ScaffoldMessenger showSnackBar', 'showModalBottomSheet layouts', 'Dismiss overlay controls'] },
  { dayNumber: 24, phase: p4_fl, topic: 'Hero Animations', description: 'Implement smooth page transition animations using Hero widgets across screens.', tasks: ['Hero widget tags mapping', 'Image transitions animations', 'FlightShuttleBuilder customization', 'Hero routing animations'] },
  { dayNumber: 25, phase: p5_fl, topic: 'State Management Overview', description: 'Understand Flutter state propagation, reactive widget rebuilds, and state lifecycles.', tasks: ['InheritedWidget state trees', 'Rebuild optimizations rules', 'Ephemeral state vs App state', 'State library choices'] },
  { dayNumber: 26, phase: p5_fl, topic: 'State Management: Provider', description: 'Master Provider state. Implement ChangeNotifier, Consumer widgets, and context read/watch queries.', tasks: ['ChangeNotifier state classes', 'ChangeNotifierProvider widgets', 'Consumer rebuild filters', 'context.watch & context.read'] },
  { dayNumber: 27, phase: p5_fl, topic: 'State Management: Riverpod', description: 'Implement Riverpod state. Write StateProviders, ConsumerStatefulWidgets, and read provider values.', tasks: ['ProviderScope initialization', 'StateProvider variable bindings', 'ConsumerWidget Ref read actions', 'ConsumerStatefulWidget states'] },
  { dayNumber: 28, phase: p5_fl, topic: 'State Management: Bloc (Cubit)', description: 'Implement Cubit state. Write Cubit classes, BlockProvider widgets, and BlockBuilders.', tasks: ['Cubit state definitions', 'BlocProvider injection widgets', 'BlocBuilder UI rebuild filters', 'Emit state events'] },
  { dayNumber: 29, phase: p5_fl, topic: 'State Management: Bloc (Advanced)', description: 'Master full Bloc pattern. Map events to states using Bloc, Event handlers, and BlocListeners.', tasks: ['Bloc Event classes', 'on<Event> handler mappings', 'BlocListener side effects checks', 'BlocObserver logger observers'] },
  { dayNumber: 30, phase: p5_fl, topic: 'Flutter Streams Integration', description: 'Integrate Dart Streams into Flutter widgets dynamically using StreamBuilder.', tasks: ['StreamBuilder constructor', 'AsyncSnapshot status checkers', 'ConnectionState handling rules', 'Stream event updates UI'] },
  { dayNumber: 31, phase: p6_fl, topic: 'API Integration: HTTP client', description: 'Integrate REST APIs. Install HTTP package, send GET requests, and parse JSON mappings.', tasks: ['http.get endpoint queries', 'http.Response response parses', 'jsonDecode parse payloads', 'Map JSON to Dart Objects'] },
  { dayNumber: 32, phase: p6_fl, topic: 'API Integration: Advanced (Dio)', description: 'Master advanced network requests. Use Dio client, configure Interceptors, and set timeouts.', tasks: ['Dio client setup options', 'Dio Interceptors logs config', 'Dio post JSON payloads', 'Timeout error handles'] },
  { dayNumber: 33, phase: p6_fl, topic: 'JSON Code Generation (JsonSerializable)', description: 'Automate model mappings. Use json_serializable and build_runner to compile parser files.', tasks: ['json_serializable declarations', '@JsonSerializable() models annotations', 'fromJson & toJson methods mapping', 'flutter pub run build_runner build'] },
  { dayNumber: 34, phase: p6_fl, topic: 'Flutter Network Error Handling', description: 'Protect network requests. Implement socket timeouts catch, internet connection checks, and error pages.', tasks: ['SocketException catch routes', 'Connectivity check plugins', 'Error UI page triggers', 'Retry fetch actions'] },
  { dayNumber: 35, phase: p6_fl, topic: 'API Caching', description: 'Save network requests locally. Design cache databases using Shared Preferences or Hive.', tasks: ['Shared Preferences key saves', 'Hive box definitions write', 'Cache expiry check variables', 'Offline data fallbacks'] },
  { dayNumber: 36, phase: p7_fl, topic: 'Local Storage: SQLite (sqflite)', description: 'Create local relational databases in Flutter. Manage schemas, write raw SQL queries, and map query results.', tasks: ['sqflite openDatabase settings', 'CREATE TABLE schemas execution', 'DB insert query statements', 'Map SQL outputs list'] },
  { dayNumber: 37, phase: p7_fl, topic: 'Local Storage: NoSQL (Hive)', description: 'Create local document stores. Open Hive boxes, read key-value pairs, and write custom adapter mappings.', tasks: ['Hive box opens configurations', 'Hive read & write actions', 'TypeAdapter definitions configs', 'Hive database compact'] },
  { dayNumber: 38, phase: p7_fl, topic: 'Firebase Integration Basics', description: 'Integrate Google Firebase. Connect Firebase Core, configure platform apps, and init connection.', tasks: ['Firebase console registration', 'google-services.json placement', 'Firebase.initializeApp()', 'Firebase debug logs check'] },
  { dayNumber: 39, phase: p7_fl, topic: 'Firebase Auth & Cloud Firestore', description: 'Implement signup/login and store data using Firebase Auth and Cloud Firestore.', tasks: ['Firebase Auth email log actions', 'Firestore collection add operations', 'Firestore StreamBuilder binding', 'User profile update mappings'] },
  { dayNumber: 40, phase: p7_fl, topic: 'Flutter Testing: Unit Tests', description: 'Write Dart logic unit tests using flutter_test assertions and verification tests.', tasks: ['flutter_test dependency setups', 'test() assertions blocks', 'expect() value comparisons', 'Mock data variables'] },
  { dayNumber: 41, phase: p7_fl, topic: 'Flutter Testing: Widget Tests', description: 'Verify UI components. Write widget tests checking element renders, text displays, and clicks.', tasks: ['testWidgets() tester triggers', 'tester.pumpWidget() renderings', 'find.byType & find.text lookups', 'tester.tap() button clicks'] },
  { dayNumber: 42, phase: p7_fl, topic: 'Flutter Testing: Golden Tests', description: 'Implement visual snapshot testing in Flutter checking pixel layouts against gold standard images.', tasks: ['matchesGoldenFile() assertions', 'Generate gold reference screenshots', 'Platform font loading configurations', 'Visual mismatch error analysis'] },
  { dayNumber: 43, phase: p7_fl, topic: 'Flutter CI/CD (Codemagic)', description: 'Configure automated builds. Set up Codemagic pipelines compiling IPA and APK packages.', tasks: ['Codemagic webhook connections', 'Android build keystores config', 'iOS certificates provisioning', 'Build triggers configs'] },
  { dayNumber: 44, phase: p7_fl, topic: 'Google Play Store Releases', description: 'Package Android apps. Compile App Bundles (AAB), sign packages, and configure Google Play Console.', tasks: ['Build release AAB command', 'Android keystore signatures generation', 'Google Play Console release track', 'Store listing asset metadata'] },
  { dayNumber: 45, phase: p7_fl, topic: 'Apple App Store Releases', description: 'Package iOS apps. Compile IPA archives, sign certificates, and configure App Store Connect.', tasks: ['Xcode provisioning profile configurations', 'Xcode Product Archive commands', 'App Store Connect build uploads', 'TestFlight user distributions'] }
];

const seedTemplates = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // Clear Roadmap Templates
    console.log('Clearing existing static RoadmapTemplates...');
    await RoadmapTemplate.deleteMany({});
    console.log('RoadmapTemplate collection cleared.');

    // Format template insertions
    const dataToSeed = [];

    // 1. Data Engineering
    deRoadmap.forEach(day => {
      dataToSeed.push({
        roadmapType: 'data-engineering',
        dayNumber: day.dayNumber,
        phase: day.phase,
        topic: day.topic,
        description: day.description,
        tasks: day.tasks
      });
    });

    // 2. Full Stack
    fsRoadmap.forEach(day => {
      dataToSeed.push({
        roadmapType: 'full-stack',
        dayNumber: day.dayNumber,
        phase: day.phase,
        topic: day.topic,
        description: day.description,
        tasks: day.tasks
      });
    });

    // 3. Java Developer
    javaRoadmap.forEach(day => {
      dataToSeed.push({
        roadmapType: 'java',
        dayNumber: day.dayNumber,
        phase: day.phase,
        topic: day.topic,
        description: day.description,
        tasks: day.tasks
      });
    });

    // 4. Flutter Developer
    flutterRoadmap.forEach(day => {
      dataToSeed.push({
        roadmapType: 'flutter',
        dayNumber: day.dayNumber,
        phase: day.phase,
        topic: day.topic,
        description: day.description,
        tasks: day.tasks
      });
    });

    console.log(`Inserting ${dataToSeed.length} roadmap templates...`);
    await RoadmapTemplate.insertMany(dataToSeed);
    console.log('Roadmap templates successfully seeded!');

    // Clean user-specific data to start fresh on auth schema
    console.log('Resetting User and UserProgress collections...');
    await User.deleteMany({});
    await UserProgress.deleteMany({});
    console.log('Reset complete. Databases are synchronized.');

    console.log('Seeding process finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedTemplates();
