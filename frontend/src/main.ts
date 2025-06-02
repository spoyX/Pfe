import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';
import { environment } from './environments/environment';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

registerLicense("Ngo9BigBOggjHTQxAR8/V1NNaF1cWWhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEBjXH1ecHBQRGFaUUJ/XUlfag==");


