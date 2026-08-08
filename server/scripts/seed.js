require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const RoadmapDay = require('../models/roadmapDay');
const User = require('../models/user');

const p1 = 'PHASE 1 — SQL & DATA ENGINEERING FOUNDATIONS';
const p2 = 'PHASE 2 — PYTHON';
const p3 = 'PHASE 3 — PYSPARK';
const p4 = 'PHASE 4 — DATABRICKS + DELTA LAKE';
const p5 = 'PHASE 5 — REAL DATA ENGINEERING';
const p6 = 'PHASE 6 — PORTFOLIO PROJECT';
const p7 = 'PHASE 7 — INTERVIEW PREPARATION';

const roadmapData = [
  // Phase 1
  {
    dayNumber: 1,
    phase: p1,
    topic: 'Relational Data + SQL Foundations',
    description: 'Establish strong foundational knowledge in relational modeling, standard and advanced SQL operators, and core concepts of data quality engineering like deduplication and integrity check systems.',
    status: 'COMPLETED',
    notes: 'Created CUSTOMERS, PRODUCTS, ORDERS and PAYMENTS datasets and performed data-quality validation.',
    completedAt: new Date(),
    startedAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    tasks: [
      { title: 'Create relational tables', completed: true },
      { title: 'Oracle data types', completed: true },
      { title: 'Primary keys', completed: true },
      { title: 'Default values', completed: true },
      { title: 'INSERT', completed: true },
      { title: 'INSERT SELECT', completed: true },
      { title: 'CONNECT BY LEVEL', completed: true },
      { title: 'LPAD', completed: true },
      { title: 'CASE', completed: true },
      { title: 'MOD', completed: true },
      { title: 'TO_CHAR', completed: true },
      { title: 'DBMS_RANDOM', completed: true },
      { title: 'JOIN', completed: true },
      { title: 'LEFT JOIN', completed: true },
      { title: 'GROUP BY', completed: true },
      { title: 'HAVING', completed: true },
      { title: 'COUNT', completed: true },
      { title: 'SUM', completed: true },
      { title: 'NULL validation', completed: true },
      { title: 'Duplicate detection', completed: true },
      { title: 'Referential integrity', completed: true },
      { title: 'Data reconciliation', completed: true },
      { title: 'Synthetic data generation', completed: true },
      { title: 'ROW_NUMBER introduction', completed: true },
      { title: 'Bronze/Silver/Gold introduction', completed: true }
    ]
  },
  {
    dayNumber: 2,
    phase: p1,
    topic: 'Advanced SQL & Window Functions',
    description: 'Learn window partitioning, order execution, offsets, and analytical expressions to handle top-N analytical requests, deduplication logic, and cumulative sums.',
    tasks: [
      { title: 'ROW_NUMBER', completed: false },
      { title: 'RANK', completed: false },
      { title: 'DENSE_RANK', completed: false },
      { title: 'LAG', completed: false },
      { title: 'LEAD', completed: false },
      { title: 'SUM OVER', completed: false },
      { title: 'AVG OVER', completed: false },
      { title: 'Top-N queries', completed: false },
      { title: 'Latest record per customer', completed: false },
      { title: 'Deduplication', completed: false },
      { title: 'Running totals', completed: false },
      { title: 'Customer ranking', completed: false },
      { title: 'Product ranking', completed: false }
    ]
  },
  {
    dayNumber: 3,
    phase: p1,
    topic: 'CTEs & Complex SQL',
    description: 'Understand Common Table Expressions, query nesting, subquery options, and code modularization to write maintainable complex queries.',
    tasks: [
      { title: 'WITH', completed: false },
      { title: 'CTEs', completed: false },
      { title: 'Subqueries', completed: false },
      { title: 'Nested queries', completed: false },
      { title: 'Complex transformations', completed: false },
      { title: 'Business-analysis queries', completed: false }
    ]
  },
  {
    dayNumber: 4,
    phase: p1,
    topic: 'SQL Performance',
    description: 'Dive into indexing structures, scanning patterns, execution plans, and join methodologies to write high-performing queries.',
    tasks: [
      { title: 'Indexes', completed: false },
      { title: 'Composite indexes', completed: false },
      { title: 'Execution plans', completed: false },
      { title: 'EXPLAIN PLAN', completed: false },
      { title: 'Full table scan', completed: false },
      { title: 'Index scan', completed: false },
      { title: 'Join optimization', completed: false },
      { title: 'Query optimization', completed: false }
    ]
  },
  {
    dayNumber: 5,
    phase: p1,
    topic: 'ETL SQL',
    description: 'Build robust staging architectures, mapping strategies, structural load patterns, and conditional UPSERT (MERGE) logic.',
    tasks: [
      { title: 'Staging tables', completed: false },
      { title: 'Extract', completed: false },
      { title: 'Transform', completed: false },
      { title: 'Load', completed: false },
      { title: 'MERGE', completed: false },
      { title: 'Upsert', completed: false },
      { title: 'Insert/update logic', completed: false },
      { title: 'Validation', completed: false }
    ]
  },
  {
    dayNumber: 6,
    phase: p1,
    topic: 'Incremental Loading',
    description: 'Contrast full snapshot processing against incremental loading using timestamps, auto-increments, and watermarking patterns.',
    tasks: [
      { title: 'Full load', completed: false },
      { title: 'Incremental load', completed: false },
      { title: 'CREATED_DATE', completed: false },
      { title: 'MODIFIED_DATE', completed: false },
      { title: 'Watermarks', completed: false },
      { title: 'New records', completed: false },
      { title: 'Changed records', completed: false }
    ]
  },
  {
    dayNumber: 7,
    phase: p1,
    topic: 'Change Data Capture',
    description: 'Examine logs, triggers, change tables, and watermarks to track inserts, updates, and deletes from a source database.',
    tasks: [
      { title: 'INSERT changes', completed: false },
      { title: 'UPDATE changes', completed: false },
      { title: 'DELETE changes', completed: false },
      { title: 'CDC concepts', completed: false },
      { title: 'Change tracking', completed: false },
      { title: 'Watermarks', completed: false }
    ]
  },
  {
    dayNumber: 8,
    phase: p1,
    topic: 'Slowly Changing Dimensions',
    description: 'Implement SCD Type 1 (overwrites) and Type 2 (historical records with effective dates, end dates, and current record flags).',
    tasks: [
      { title: 'SCD Type 1', completed: false },
      { title: 'SCD Type 2', completed: false },
      { title: 'Historical records', completed: false },
      { title: 'Effective dates', completed: false },
      { title: 'End dates', completed: false },
      { title: 'Current flag', completed: false }
    ]
  },
  {
    dayNumber: 9,
    phase: p1,
    topic: 'Data Quality Engineering',
    description: 'Construct validation scripts checking primary key integrity, nullability, column formatting rules, and orphan references.',
    tasks: [
      { title: 'Duplicate checks', completed: false },
      { title: 'NULL checks', completed: false },
      { title: 'Invalid formats', completed: false },
      { title: 'Orphan records', completed: false },
      { title: 'Referential checks', completed: false },
      { title: 'Business-rule validation', completed: false },
      { title: 'Reconciliation', completed: false }
    ]
  },
  {
    dayNumber: 10,
    phase: p1,
    topic: 'SQL Interview Day',
    description: 'Consolidate SQL knowledge by tackling realistic interview assignments covering window functions, CTEs, optimization, and edge cases.',
    tasks: [
      { title: 'SQL interview questions', completed: false },
      { title: 'Window functions', completed: false },
      { title: 'Joins', completed: false },
      { title: 'CTEs', completed: false },
      { title: 'Aggregations', completed: false },
      { title: 'Data-quality scenarios', completed: false },
      { title: 'Practical SQL problems', completed: false }
    ]
  },

  // Phase 2
  {
    dayNumber: 11,
    phase: p2,
    topic: 'Python Fundamentals',
    description: 'Review variable scopes, native collections, conditional pathways, control structures, and iterable loops in Python.',
    tasks: [
      { title: 'Variables', completed: false },
      { title: 'Data types', completed: false },
      { title: 'Lists', completed: false },
      { title: 'Tuples', completed: false },
      { title: 'Sets', completed: false },
      { title: 'Dictionaries', completed: false },
      { title: 'Conditions', completed: false },
      { title: 'Loops', completed: false }
    ]
  },
  {
    dayNumber: 12,
    phase: p2,
    topic: 'Python Functions & Error Handling',
    description: 'Author custom reusable functions, lambda expressions, variable arguments, exception catching blocks, and module imports.',
    tasks: [
      { title: 'Functions', completed: false },
      { title: 'Lambda', completed: false },
      { title: '*args', completed: false },
      { title: '**kwargs', completed: false },
      { title: 'Exceptions', completed: false },
      { title: 'Modules', completed: false }
    ]
  },
  {
    dayNumber: 13,
    phase: p2,
    topic: 'Python Files & Data',
    description: 'Read and write local files (CSV, JSON, text formats) and structure parser functions for loading configuration payloads.',
    tasks: [
      { title: 'CSV', completed: false },
      { title: 'JSON', completed: false },
      { title: 'TXT', completed: false },
      { title: 'File reading', completed: false },
      { title: 'File writing', completed: false },
      { title: 'JSON parsing', completed: false }
    ]
  },
  {
    dayNumber: 14,
    phase: p2,
    topic: 'Pandas',
    description: 'Explore the Pandas library. Learn DataFrames, series selection, grouping aggregates, structural merging, and fill algorithms.',
    tasks: [
      { title: 'DataFrame', completed: false },
      { title: 'read_csv', completed: false },
      { title: 'filter', completed: false },
      { title: 'groupby', completed: false },
      { title: 'merge', completed: false },
      { title: 'drop_duplicates', completed: false },
      { title: 'fillna', completed: false }
    ]
  },
  {
    dayNumber: 15,
    phase: p2,
    topic: 'Python + SQL',
    description: 'Establish programmatic connections to databases (e.g. Oracle, SQLite, Postgres) to query and output table records using Python scripts.',
    tasks: [
      { title: 'Oracle connection', completed: false },
      { title: 'Extract data', completed: false },
      { title: 'Transform data', completed: false },
      { title: 'Load data', completed: false }
    ]
  },
  {
    dayNumber: 16,
    phase: p2,
    topic: 'Python ETL',
    description: 'Construct a complete local ETL pipeline using Python and Pandas. Extract, transform schema, run validations, and write clean outputs.',
    tasks: [
      { title: 'Extract', completed: false },
      { title: 'Transform', completed: false },
      { title: 'Validate', completed: false },
      { title: 'Load', completed: false }
    ]
  },

  // Phase 3
  {
    dayNumber: 17,
    phase: p3,
    topic: 'Spark Fundamentals',
    description: 'Deconstruct Spark architecture, tracing executions across drivers and executors, and understanding how stages and tasks are organized.',
    tasks: [
      { title: 'Spark', completed: false },
      { title: 'Driver', completed: false },
      { title: 'Executor', completed: false },
      { title: 'Cluster', completed: false },
      { title: 'Jobs', completed: false },
      { title: 'Stages', completed: false },
      { title: 'Tasks', completed: false }
    ]
  },
  {
    dayNumber: 18,
    phase: p3,
    topic: 'Spark DataFrames',
    description: 'Establish standard reads and writes in PySpark, filtering rows, projecting columns, and creating or renaming columns.',
    tasks: [
      { title: 'read', completed: false },
      { title: 'select', completed: false },
      { title: 'filter', completed: false },
      { title: 'withColumn', completed: false },
      { title: 'drop', completed: false }
    ]
  },
  {
    dayNumber: 19,
    phase: p3,
    topic: 'PySpark Transformations',
    description: 'Perform advanced column operations using nested conditions (when/otherwise), regex replacement, and string tokenization.',
    tasks: [
      { title: 'when', completed: false },
      { title: 'otherwise', completed: false },
      { title: 'cast', completed: false },
      { title: 'regexp_replace', completed: false },
      { title: 'split', completed: false }
    ]
  },
  {
    dayNumber: 20,
    phase: p3,
    topic: 'PySpark Joins',
    description: 'Contrast join strategies in Spark, implementing inner, outer, left, right, and full joins, and watching out for data skew.',
    tasks: [
      { title: 'Inner join', completed: false },
      { title: 'Left join', completed: false },
      { title: 'Right join', completed: false },
      { title: 'Full join', completed: false },
      { title: 'Cross join', completed: false }
    ]
  },
  {
    dayNumber: 21,
    phase: p3,
    topic: 'PySpark Aggregations',
    description: 'Learn how to group datasets and write multiple aggregate operations (sums, averages, counts, and custom aliases) across partitions.',
    tasks: [
      { title: 'groupBy', completed: false },
      { title: 'agg', completed: false },
      { title: 'count', completed: false },
      { title: 'sum', completed: false },
      { title: 'avg', completed: false }
    ]
  },
  {
    dayNumber: 22,
    phase: p3,
    topic: 'PySpark Window Functions',
    description: 'Perform partition analytics in Spark. Set up window specifications, rank rows, extract lead/lag offsets, and compute running totals.',
    tasks: [
      { title: 'Window.partitionBy', completed: false },
      { title: 'row_number', completed: false },
      { title: 'rank', completed: false },
      { title: 'deduplication', completed: false },
      { title: 'running totals', completed: false },
      { title: 'lag', completed: false },
      { title: 'lead', completed: false }
    ]
  },
  {
    dayNumber: 23,
    phase: p3,
    topic: 'PySpark Data Quality',
    description: 'Translate SQL-based quality checks into scalable PySpark validation actions checking for duplicates, null records, and format issues.',
    tasks: [
      { title: 'Duplicate detection', completed: false },
      { title: 'NULL checks', completed: false },
      { title: 'Invalid records', completed: false },
      { title: 'Referential checks', completed: false },
      { title: 'Business rules', completed: false }
    ]
  },
  {
    dayNumber: 24,
    phase: p3,
    topic: 'PySpark ETL Project',
    description: 'Write an end-to-end Python Spark application extracting records, applying schema conversions, executing quality validations, and outputting partition tables.',
    tasks: [
      { title: 'Oracle extraction', completed: false },
      { title: 'PySpark transformation', completed: false },
      { title: 'Data validation', completed: false },
      { title: 'Output generation', completed: false }
    ]
  },

  // Phase 4
  {
    dayNumber: 25,
    phase: p4,
    topic: 'Databricks Fundamentals',
    description: 'Navigate the Databricks Workspace, creating compute clusters, writing code in shared notebooks, and configuring SQL Warehouses.',
    tasks: [
      { title: 'Workspace', completed: false },
      { title: 'Notebooks', completed: false },
      { title: 'Compute', completed: false },
      { title: 'Clusters', completed: false },
      { title: 'Jobs', completed: false },
      { title: 'SQL Warehouse', completed: false }
    ]
  },
  {
    dayNumber: 26,
    phase: p4,
    topic: 'Databricks + PySpark',
    description: 'Connect Databricks notebooks to cloud object storage (e.g. DBFS) to fetch, process, and save partitioned datasets.',
    tasks: [
      { title: 'Run PySpark notebooks', completed: false },
      { title: 'Read data', completed: false },
      { title: 'Transform data', completed: false },
      { title: 'Write data', completed: false }
    ]
  },
  {
    dayNumber: 27,
    phase: p4,
    topic: 'Delta Lake',
    description: 'Contrast standard Parquet layouts with Delta format properties. Study ACID transactions, time travel, and schema validations.',
    tasks: [
      { title: 'Parquet vs Delta', completed: false },
      { title: 'ACID transactions', completed: false },
      { title: 'Schema enforcement', completed: false },
      { title: 'Schema evolution', completed: false },
      { title: 'Time travel', completed: false }
    ]
  },
  {
    dayNumber: 28,
    phase: p4,
    topic: 'Medallion Architecture',
    description: 'Understand the Medallion pattern: raw ingestion (Bronze), cleansed core records (Silver), and aggregated business models (Gold).',
    tasks: [
      { title: 'Bronze', completed: false },
      { title: 'Silver', completed: false },
      { title: 'Gold', completed: false },
      { title: 'Data flow design', completed: false }
    ]
  },
  {
    dayNumber: 29,
    phase: p4,
    topic: 'Bronze Layer',
    description: 'Create Bronze tables in Delta format, loading raw datasets for Customers, Products, Orders, and Payments with minimal schemas.',
    tasks: [
      { title: 'Load raw Oracle data', completed: false },
      { title: 'Customers', completed: false },
      { title: 'Products', completed: false },
      { title: 'Orders', completed: false },
      { title: 'Payments', completed: false }
    ]
  },
  {
    dayNumber: 30,
    phase: p4,
    topic: 'Silver Layer',
    description: 'Design Silver layer tables. Cleanse data by removing duplicates, handling null fields, standardizing strings, and checking keys.',
    tasks: [
      { title: 'Deduplication', completed: false },
      { title: 'NULL handling', completed: false },
      { title: 'Invalid records', completed: false },
      { title: 'Referential checks', completed: false },
      { title: 'Standardization', completed: false }
    ]
  },
  {
    dayNumber: 31,
    phase: p4,
    topic: 'Gold Layer',
    description: 'Generate Gold reporting aggregates, building business-ready views of daily revenue, customer purchases, and product sales statistics.',
    tasks: [
      { title: 'Daily revenue', completed: false },
      { title: 'Customer sales', completed: false },
      { title: 'Product sales', completed: false },
      { title: 'Payment analysis', completed: false }
    ]
  },
  {
    dayNumber: 32,
    phase: p4,
    topic: 'Delta Optimization',
    description: 'Maximize query speeds. Study partitioning, Z-Ordering, small file compaction (OPTIMIZE), and table VACUUM logs.',
    tasks: [
      { title: 'Partitioning', completed: false },
      { title: 'OPTIMIZE', completed: false },
      { title: 'ZORDER', completed: false },
      { title: 'File management', completed: false },
      { title: 'Performance', completed: false }
    ]
  },

  // Phase 5
  {
    dayNumber: 33,
    phase: p5,
    topic: 'Incremental Pipelines',
    description: 'Construct stateful incremental pipelines processing only new or updated files, using directory checkpoints and watermark variables.',
    tasks: [
      { title: 'Initial load', completed: false },
      { title: 'Incremental load', completed: false },
      { title: 'New records', completed: false },
      { title: 'Changed records', completed: false }
    ]
  },
  {
    dayNumber: 34,
    phase: p5,
    topic: 'MERGE / UPSERT',
    description: 'Implement Delta Lake MERGE operations to process updates and inserts concurrently in the Silver and Gold layers.',
    tasks: [
      { title: 'Delta MERGE', completed: false },
      { title: 'Insert', completed: false },
      { title: 'Update', completed: false },
      { title: 'Incremental processing', completed: false }
    ]
  },
  {
    dayNumber: 35,
    phase: p5,
    topic: 'SCD Type 2 in Databricks',
    description: 'Track histories dynamically by structuring Delta tables with active flags, start times, and expiration dates during inserts/updates.',
    tasks: [
      { title: 'Customer history', completed: false },
      { title: 'Effective date', completed: false },
      { title: 'End date', completed: false },
      { title: 'Current flag', completed: false }
    ]
  },
  {
    dayNumber: 36,
    phase: p5,
    topic: 'Databricks Workflows',
    description: 'Schedule multi-task notebooks using Databricks Workflows. Link jobs, define execution trees, and configure runtime alerts.',
    tasks: [
      { title: 'Notebook', completed: false },
      { title: 'Task', completed: false },
      { title: 'Job', completed: false },
      { title: 'Schedule', completed: false },
      { title: 'Dependencies', completed: false }
    ]
  },
  {
    dayNumber: 37,
    phase: p5,
    topic: 'Monitoring & Error Handling',
    description: 'Set up error routing. Capture pipeline warnings, isolate bad rows into quarantine tables, and dispatch failure alerts.',
    tasks: [
      { title: 'Pipeline failures', completed: false },
      { title: 'Logging', completed: false },
      { title: 'Retry', completed: false },
      { title: 'Validation', completed: false },
      { title: 'Bad records', completed: false },
      { title: 'Alerts', completed: false }
    ]
  },

  // Phase 6 - Portfolio Project (Days 38-41 split)
  {
    dayNumber: 38,
    phase: p6,
    topic: 'Oracle → Databricks Retail Pipeline: Setup & Bronze Ingestion',
    description: 'Day 1 of the portfolio project. Set up the raw retail dataset (100K+ orders, customers, products, payments), establish connections, and implement the Bronze ingestion layer.',
    tasks: [
      { title: 'Generate 100K+ synthetic orders, customers, and payments data', completed: false },
      { title: 'Establish connection between data source and Databricks Workspace', completed: false },
      { title: 'Develop Bronze ingestion pipeline using PySpark', completed: false },
      { title: 'Verify raw data count and ingestion checksums', completed: false }
    ]
  },
  {
    dayNumber: 39,
    phase: p6,
    topic: 'Oracle → Databricks Retail Pipeline: Data Quality & Silver Cleansing',
    description: 'Day 2 of the portfolio project. Design schema validation, remove duplicates, handle missing values, and transform Bronze data into the Silver layer.',
    tasks: [
      { title: 'Implement duplicate detection check in PySpark', completed: false },
      { title: 'Configure Null validation and quarantine handler for orders', completed: false },
      { title: 'Perform data-type standardization and address formatting rules', completed: false },
      { title: 'Build and load Silver layer Delta tables', completed: false }
    ]
  },
  {
    dayNumber: 40,
    phase: p6,
    topic: 'Oracle → Databricks Retail Pipeline: SCD Type 2 & Incremental Loads',
    description: 'Day 3 of the portfolio project. Develop incremental load paths using watermarking and implement historical customer tracking via Slowly Changing Dimensions (SCD Type 2).',
    tasks: [
      { title: 'Build watermark logic to detect new source transactions', completed: false },
      { title: 'Write Delta MERGE upsert queries for incremental processing', completed: false },
      { title: 'Develop SCD Type 2 pipeline tracking customer address histories', completed: false },
      { title: 'Validate history retention using Delta time travel queries', completed: false }
    ]
  },
  {
    dayNumber: 41,
    phase: p6,
    topic: 'Oracle → Databricks Retail Pipeline: Gold Analytics & Workflow Jobs',
    description: 'Day 4 of the portfolio project. Construct aggregate business reporting tables in the Gold layer and orchestrate the full pipeline using Databricks Workflows.',
    tasks: [
      { title: 'Write Gold transformations for daily revenue metrics', completed: false },
      { title: 'Perform product affinity and payment type aggregations', completed: false },
      { title: 'Assemble Bronze-Silver-Gold notebooks into a Databricks Job', completed: false },
      { title: 'Configure cron schedules and error alerting configurations', completed: false }
    ]
  },

  // Phase 7
  {
    dayNumber: 42,
    phase: p7,
    topic: 'SQL Interview Preparation',
    description: 'Work through complex mock interview problems on window functions, recursive joins, query optimizations, and data quality check queries.',
    tasks: [
      { title: 'Solve 50+ intermediate/advanced SQL queries', completed: false },
      { title: 'Solve top-N records per category with window queries', completed: false },
      { title: 'Solve database optimization and explain plan challenges', completed: false },
      { title: 'Explain data-quality and referential constraint checks', completed: false }
    ]
  },
  {
    dayNumber: 43,
    phase: p7,
    topic: 'PySpark Interview Preparation',
    description: 'Master questions detailing Spark cluster structure, partitioning, caching rules, broad-join optimizations, and DAG stage divisions.',
    tasks: [
      { title: 'Explain Catalyst optimizer and Tungsten execution engine', completed: false },
      { title: 'Review narrow vs wide transformations and partition strategies', completed: false },
      { title: 'Detail caching policies (cache vs persist vs checkpoint)', completed: false },
      { title: 'Solve PySpark window analytical exercises', completed: false }
    ]
  },
  {
    dayNumber: 44,
    phase: p7,
    topic: 'Databricks Interview Preparation',
    description: 'Prepare responses regarding Delta table internals, Medallion structure advantages, and incremental load implementations.',
    tasks: [
      { title: 'Explain Delta transaction log and ACID guarantees', completed: false },
      { title: 'Explain schema enforcement vs schema evolution in Delta Lake', completed: false },
      { title: 'Detail Medallion architecture and data flow advantages', completed: false },
      { title: 'Explain how incremental watermarks track changes', completed: false }
    ]
  },
  {
    dayNumber: 45,
    phase: p7,
    topic: 'Mock Interview + Resume Finalization',
    description: 'Refine your professional data engineering resume, structure your project narratives, and perform mock interviews.',
    tasks: [
      { title: 'Draft and review Data Engineer resume layout', completed: false },
      { title: 'Formulate project architecture summaries in STAR format', completed: false },
      { title: 'Practice core systems design and pipelines explanations', completed: false },
      { title: 'Prepare for salary negotiations and career growth paths', completed: false }
    ]
  }
];

const seedDB = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/de_roadmap');
    console.log('Connected.');

    // Clear Roadmap Days
    console.log('Clearing existing RoadmapDay records...');
    await RoadmapDay.deleteMany({});
    console.log('RoadmapDay collection cleared.');

    // Populate Roadmap Days
    console.log('Inserting roadmap days...');
    await RoadmapDay.insertMany(roadmapData);
    console.log(`Successfully seeded ${roadmapData.length} roadmap days.`);

    // Initialize or Reset default User settings if they don't exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Creating default User Settings record...');
      await User.create({
        name: 'Student',
        email: 'user@example.com',
        phoneNumber: '+919876543210',
        timezone: 'Asia/Kolkata',
        reminderTime: '08:00 PM',
        emailReminderEnabled: true,
        smsReminderEnabled: true,
        roadmapStartDate: new Date().toISOString().split('T')[0] // default to today
      });
      console.log('Default settings created.');
    } else {
      console.log('User settings record already exists. Keeping it.');
    }

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
