# ng2-metadata
This repository holds the TypeScript source code and distributable bundle of **`ng2-metadata`**, the dynamic page title &amp; meta tags generator for Angular2.

## Prerequisites
Verify that you are running at least `@angular v2.1.0` and `@angular/router v3.0.0`. Older versions are not tested, might produce errors.

## Getting started
### Installation
You can install **`ng2-metadata`** using `npm`
```
npm install ng2-metadata --save
```
### Adding ng2-metadata to your project
Add `map` for **`ng2-metadata`** in your `systemjs.config`
```javascript
'ng2-metadata': 'node_modules/ng2-metadata/bundles/ng2-metadata.umd.min.js'
```

### Route configuration
Add metadata inside the `data` property of routes.

**Note:** meta properties such as `title`, `description`, `author` and `publisher` are duplicated as `og:title`, `og:description`, `og:author` and `og:publisher`, so there's no need to declare them again in this context.

```TypeScript
const routes = [
  {
    path : 'home',
    component : HomeComponent,
    data : {
      metadata : {
        title : 'Sweet home',
        description : 'Home, home sweet home... and what?',
      }
    }
  },
  {
    path : 'duck',
    component : DuckComponent,
    data : {
      metadata : {
        title : 'Rubber duckie',
        description : 'Have you seen my rubber duckie?',
      }
    }
  },
  {
    path : 'toothpaste',
    component : ToothpasteComponent,
    data : {
      metadata : {
        title : 'Toothpaste',
        override : true, // prevents appending/prepending the application name to the title attribute
        description : 'Eating toothpaste is considered to be too healthy!',
      }
    }
  }
  ...
];
```

### app.module configuration
Import **MetadataModule** using the mapping `'ng2-metadata'` and append `MetadataModule.forRoot()` within the imports property of app.module (*considering the app.module is the core module in the angular application*).

```TypeScript
...
import { MetadataModule } from 'ng2-metadata';
...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    ...
    RouterModule.forRoot(routes),
    MetadataModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
```

### app.component configuration
Import **MetadataService** using the mapping `'ng2-metadata'` and inject it in the constructor of app.component (*considering the app.component is the bootstrap component in the angular application*).

```TypeScript
...
import { MetadataService } from 'ng2-metadata';
...

@Component({
  ...
})
export class AppComponent {
  ...
  constructor(private metadataService: MetadataService) { }
  ...
}
```

Holy cow! **`ng2-metadata`** will update the page title & meta tags every time the route changes.

## Settings
You can import the **MetadataModule** using **default metadata settings**.

The **default metadata settings** are used when a route doesn't contain any metadata in its `data` property.

```TypeScript
...
import { MetadataSettings, PageTitlePositioning, MetadataService } from 'ng2-meta';
...

const metadataSettings: MetadataSettings = {
  pageTitlePositioning : PageTitlePositioning.PrependPageTitle,
  pageTitleSeparator : ' - ',
  applicationName : 'Tour of (lazy/busy) heroes',
  defaults : {
    title : 'Mighty mighty mouse',
    description : 'Mighty Mouse is an animated superhero mouse character',
    'og:image' : 'https://upload.wikimedia.org/wikipedia/commons/f/f8/superraton.jpg'
    'og:type' : 'website',
    'og:locale' : 'en-US'
  }
};

...

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    ...
    RouterModule.forRoot(routes),
    MetadataModule.forRoot(metadataSettings)
  ],
  bootstrap: [AppComponent]
})
```

### Set metadata programmatically
```TypeScript
...
import { Component, OnInit } from '@angular/core';
import { MetadataService } from 'ng2-metadata';
...

@Component({
  ...
})
export class ItemComponent implements OnInit {
  ...
  constructor(private metadataService: MetadataService) { }
  ...
  ngOnInit() {
    this.item = //HTTP GET for "item" in the repository
    this.metadataService.setTitle(`Page for ${this.item.name}`);
    this.metadataService.setTag('og:image', this.product.imageUrl);
  }
}

```

## Licence
The MIT License (MIT)

Copyright © 2016 [fulls1z3](https://www.github.com/fulls1z3)
