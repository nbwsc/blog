# ionic2相关

## 能够原生支持ionic2的android system version是4.5，

* 4.4或以下无法打开app
* 4.5能打开,但是加载速度很慢,而且android墨水动画都没有,it works but ugly
* 7.0能打开速度较快,动画效果也都保留.

### 打包浏览器以后

* 4.4 能打开,size变成近80M.且没有墨水动画;
* 7.0 能打开,size变成90M+,且有墨水动画;

### showWhen="core,android,windows"
showWhen to check current device & you can select what you want to show in target devices


### custom dirctinve(component)

```bash
ionic g directive $YOUR_COMPONENT
```
Modify src/app/app.module.ts to reflect the following:
```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { YOUR_COMPONENT } from '../components/elastic-header/elastic-header';
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    YOUR_COMPONENT
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: []
})
export class AppModule {}
```
then you can Create the Elastic Header Directive
