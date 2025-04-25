import { Component } from '@angular/core';
import { DragAndDropService, ExcelExportService, ResizeService, ScheduleModule, View } from '@syncfusion/ej2-angular-schedule'
import { WeekService, MonthService, WorkWeekService, DayService, AgendaService } from '@syncfusion/ej2-angular-schedule';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ScheduleModule],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService,DragAndDropService ,ResizeService,ExcelExportService ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  

}
