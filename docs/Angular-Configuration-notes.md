# Angular Configuration Files - Interview Guide

## Overview

Angular projects use several configuration files to define project structure, build settings, TypeScript compilation, and dependencies. Understanding these files is crucial for interviews.

---

## 1. angular.json

### What is angular.json?

The main configuration file for Angular CLI workspace. It defines how Angular CLI should build, serve, and test your application.

### Key Concepts for Interviews

#### Project Structure
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "task-ui": { ... }
  }
}
```

**Interview Points:**
- `$schema`: Provides IntelliSense and validation in IDEs
- `version`: Angular workspace version (currently version 1)
- `projects`: Can contain multiple applications and libraries in a monorepo

#### Project Configuration

```json
"task-ui": {
  "projectType": "application",
  "root": "",
  "sourceRoot": "src",
  "prefix": "app"
}
```

**Key Properties:**
- **projectType**: `"application"` or `"library"`
- **root**: Project root directory (empty string means workspace root)
- **sourceRoot**: Where source code lives (typically `"src"`)
- **prefix**: Component selector prefix (e.g., `app-component` uses `"app"`)

#### Schematics Configuration

```json
"schematics": {
  "@schematics/angular:component": {
    "style": "scss"
  }
}
```

**Interview Point:** Defines defaults when generating code via CLI
- When you run `ng generate component`, it will use SCSS instead of CSS

#### Build Configuration

```json
"architect": {
  "build": {
    "builder": "@angular/build:application",
    "options": { ... },
    "configurations": { ... }
  }
}
```

**Important Properties:**

1. **browser**: Entry point file (`"src/main.ts"`)
2. **tsConfig**: TypeScript configuration file to use
3. **inlineStyleLanguage**: Style preprocessor (`"scss"`, `"sass"`, `"less"`)
4. **assets**: Static files to copy during build
5. **styles**: Global stylesheets

#### Build Configurations

**Production Configuration:**
```json
"production": {
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kB",
      "maximumError": "1MB"
    }
  ],
  "outputHashing": "all"
}
```

**Interview Points:**
- **budgets**: Size limits for bundles (warns/errors if exceeded)
- **outputHashing**: Adds hash to filenames for cache busting (`"all"`, `"none"`, `"media"`, `"bundles"`)
- Production builds are optimized by default

**Development Configuration:**
```json
"development": {
  "optimization": false,
  "extractLicenses": false,
  "sourceMap": true
}
```

**Interview Points:**
- **optimization**: Disabled for faster builds
- **sourceMap**: Enabled for debugging (shows original TypeScript in browser)
- **extractLicenses**: Don't extract third-party licenses

#### Serve Configuration

```json
"serve": {
  "builder": "@angular/build:dev-server",
  "configurations": {
    "development": {
      "buildTarget": "task-ui:build:development"
    }
  },
  "defaultConfiguration": "development"
}
```

**Interview Points:**
- Development server uses webpack dev server with hot module replacement
- `buildTarget` references build configurations
- Default configuration used when running `ng serve`

### Common Interview Questions

**Q: What's the difference between production and development builds?**

A: 
- **Production**: Optimized, minified, tree-shaken, hashed filenames, AOT compilation
- **Development**: Unoptimized, source maps, faster builds, better debugging

**Q: What are budgets in angular.json?**

A: Size limits for your bundles. If exceeded:
- **Warning**: Build succeeds but warns
- **Error**: Build fails

**Q: What is outputHashing?**

A: Adds content hash to filenames (e.g., `main.a1b2c3d4.js`) for cache busting. Browser downloads new version when file changes.

---

## 2. tsconfig.json

### What is tsconfig.json?

Root TypeScript configuration file. Defines how TypeScript compiler should transpile code.

### Key Compiler Options

```json
"compilerOptions": {
  "strict": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "skipLibCheck": true,
  "isolatedModules": true,
  "experimentalDecorators": true,
  "importHelpers": true,
  "target": "ES2022",
  "module": "preserve"
}
```

#### Important Options for Interviews

**1. strict: true**
- Enables all strict type-checking options
- Includes: `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, etc.

**2. noImplicitOverride: true**
- Must use `override` keyword when overriding parent class methods
```typescript
class Parent {
  method() {}
}
class Child extends Parent {
  override method() {} // Required
}
```

**3. noImplicitReturns: true**
- All code paths in function must return a value
```typescript
function getValue(flag: boolean): number {
  if (flag) {
    return 1;
  }
  // Error: Not all code paths return a value
}
```

**4. experimentalDecorators: true**
- **Critical for Angular!** Enables decorators like `@Component`, `@Injectable`

**5. target: "ES2022"**
- Specifies JavaScript version to compile to
- Modern browsers support ES2022

**6. module: "preserve"**
- Preserves the original module format (ESM)
- New in Angular 21 for better ES modules support

**7. isolatedModules: true**
- Each file can be transpiled independently
- Required for faster builds and some build tools

**8. skipLibCheck: true**
- Skip type checking of declaration files (`.d.ts`)
- Faster compilation

### Angular Compiler Options

```json
"angularCompilerOptions": {
  "enableI18nLegacyMessageIdFormat": false,
  "strictInjectionParameters": true,
  "strictInputAccessModifiers": true,
  "strictTemplates": true
}
```

**Interview Points:**

1. **strictInjectionParameters**: Dependencies must have valid types
2. **strictInputAccessModifiers**: Enforce access modifiers on `@Input()` properties
3. **strictTemplates**: Enable strict type checking in templates

### Project References

```json
"files": [],
"references": [
  { "path": "./tsconfig.app.json" },
  { "path": "./tsconfig.spec.json" }
]
```

**Interview Point:** TypeScript project references for better build performance. Base config is extended by specific configs.

---

## 3. tsconfig.app.json

### What is tsconfig.app.json?

TypeScript configuration specifically for application code (not tests).

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

### Key Points

**1. extends: "./tsconfig.json"**
- Inherits all settings from base `tsconfig.json`
- Overrides only specific options

**2. outDir: "./out-tsc/app"**
- Where compiled JavaScript files are output
- Temporary directory (usually ignored in version control)

**3. types: []**
- Empty array means don't automatically include any `@types` packages
- Angular includes only what's needed

**4. include: ["src/**/*.ts"]**
- Glob pattern: Include all TypeScript files in `src` directory

**5. exclude: ["src/**/*.spec.ts"]**
- Exclude test files from application build
- Tests have their own config (`tsconfig.spec.json`)

### Interview Question

**Q: Why do we need separate tsconfig files?**

A: 
- **Different contexts**: App code vs test code have different requirements
- **Optimization**: Exclude tests from production builds
- **Type definitions**: Tests might need additional types (e.g., Jasmine, Jest)

---

## 4. package.json

### What is package.json?

Node.js project manifest. Defines dependencies, scripts, and project metadata.

### Scripts Section

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

**Interview Points:**

- **start**: Runs dev server (`npm start` → `ng serve`)
- **build**: Production build (`npm run build` → `ng build`)
- **watch**: Continuous development build (rebuilds on file changes)
- **test**: Runs unit tests

### Dependencies vs DevDependencies

#### Dependencies (Runtime)
```json
"dependencies": {
  "@angular/common": "^21.1.0",
  "@angular/compiler": "^21.1.0",
  "@angular/core": "^21.1.0",
  "@angular/forms": "^21.1.0",
  "@angular/platform-browser": "^21.1.0",
  "@angular/router": "^21.1.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0"
}
```

**Interview Points:**
- Required for application to run
- Included in production bundles
- **@angular/core**: Core Angular framework
- **@angular/common**: Common directives and pipes
- **@angular/router**: Routing functionality
- **rxjs**: Reactive programming library (Observables)
- **tslib**: TypeScript runtime helpers

#### DevDependencies (Development Only)
```json
"devDependencies": {
  "@angular/build": "^21.1.4",
  "@angular/cli": "^21.1.4",
  "@angular/compiler-cli": "^21.1.0",
  "typescript": "~5.9.2",
  "vitest": "^4.0.8"
}
```

**Interview Points:**
- Only needed during development/build
- Not included in production bundles
- **@angular/cli**: Command-line interface
- **@angular/build**: Build system (replaced Webpack)
- **typescript**: TypeScript compiler
- **vitest**: Testing framework (alternative to Karma/Jasmine)

### Version Prefixes

```json
"@angular/core": "^21.1.0",  // Caret
"rxjs": "~7.8.0",             // Tilde
"tslib": "^2.3.0"             // Caret
```

**Interview Points:**

- **^** (Caret): Compatible with version, allows minor and patch updates
  - `^21.1.0` → Allows `21.x.x` but not `22.0.0`
- **~** (Tilde): Approximately equivalent, allows only patch updates
  - `~7.8.0` → Allows `7.8.x` but not `7.9.0`
- **No prefix**: Exact version only

### Prettier Configuration

```json
"prettier": {
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

**Interview Point:** Code formatter configuration embedded in package.json. Uses Angular-specific HTML parser.

---

## Common Interview Questions - Configuration Files

### Q1: What happens when you run `ng build`?

A:
1. Reads `angular.json` to find build configuration
2. Uses TypeScript compiler with `tsconfig.app.json`
3. Compiles TypeScript to JavaScript
4. Bundles modules together
5. Optimizes (tree-shaking, minification)
6. Generates output in `dist/` directory
7. Applies output hashing to filenames

### Q2: What's the difference between `ng build` and `ng build --configuration=production`?

A:
- Without flag: Uses `defaultConfiguration` from `angular.json` (usually "production")
- With production flag: Explicitly uses production settings
- Production: optimization, minification, AOT, hashing enabled
- Development: optimization off, source maps on, faster builds

### Q3: How does Angular handle multiple environments?

A:
- Use `fileReplacements` in `angular.json` (older approach)
- Use build configurations in `angular.json`
- Environment-specific files: `environment.ts`, `environment.prod.ts`
- Modern approach: Use environment variables directly

### Q4: What is AOT compilation?

A: **Ahead-of-Time Compilation**
- Templates compiled during build (not in browser)
- Benefits: Smaller bundles, faster rendering, catch errors early
- Default in production
- Opposite: JIT (Just-in-Time) compilation

### Q5: What's the purpose of tslib?

A: 
- Contains TypeScript runtime helper functions
- Reduces code duplication across modules
- Instead of emitting helpers in every file, imports from `tslib`
- Smaller bundle sizes

### Q6: Why does Angular use RxJS?

A:
- Reactive programming with Observables
- Handle async operations (HTTP, events)
- Powerful operators for data transformation
- Used internally by Angular (HttpClient, Forms, Router)

### Q7: What's the difference between Angular 21's new build system vs old Webpack?

A:
- **Old**: `@angular-devkit/build-angular` with Webpack
- **New**: `@angular/build` with esbuild and Vite
- **Benefits**: 
  - Much faster builds (10x in some cases)
  - Better development experience
  - Native ES modules support
  - Smaller bundle sizes

---

## Key Takeaways for Interviews

### Configuration Files Hierarchy
```
angular.json          → CLI workspace configuration
├── tsconfig.json     → Base TypeScript config
├── tsconfig.app.json → Application TypeScript config
├── tsconfig.spec.json → Test TypeScript config
└── package.json      → Dependencies and scripts
```

### Important Commands to Know
```bash
ng serve                    # Development server
ng build                    # Production build
ng build --configuration=development  # Dev build
ng test                     # Run tests
ng generate component       # Generate code
```

### Configuration Best Practices
1. Use strict TypeScript settings for type safety
2. Configure appropriate bundle budgets
3. Separate development and production configurations
4. Use semantic versioning for dependencies
5. Keep dependencies updated regularly

### Red Flags in Interviews
- Not knowing what `angular.json` does
- Confusing dependencies vs devDependencies
- Not understanding AOT vs JIT compilation
- Not knowing TypeScript strict mode benefits
- Unable to explain build optimization settings