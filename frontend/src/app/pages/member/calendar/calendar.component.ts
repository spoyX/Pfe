import { Component, ViewChild } from '@angular/core';
import { ActionEventArgs, DragAndDropService, EventSettingsModel, ExcelExportService, PopupOpenEventArgs, ResizeService, ScheduleComponent, ScheduleModule, View } from '@syncfusion/ej2-angular-schedule'
import { WeekService, MonthService, WorkWeekService, DayService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { CalendarService } from '../../../core/services/calendar/calendar.service';
import { parseISO } from 'date-fns';
import { readOnlyMode } from '@syncfusion/ej2-angular-richtexteditor';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ScheduleModule,RouterLink],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  public currentView: string = 'WorkWeek';
  public eventSettings: EventSettingsModel = { dataSource: [] };
  constructor(private svc: CalendarService) { }

  ngOnInit(): void {
      this.loadEvents();
  }

  private loadEvents(): void {
    this.svc.getAllEvents().subscribe(
      (response: any) => {
        // First check if the response is an array, otherwise try to extract events
        const events = Array.isArray(response) ? response : response.events || [];

        console.log("Raw Event Data:", events); // Log the raw data

        const formattedEvents = events.map((e: any) => ({
          Id: e._id,
          Subject: e.title,
          Location: e.location || '',
          StartTime: parseISO(e.start as string), // Parse the ISO date string
          EndTime: parseISO(e.end as string),   // Parse the ISO date string
          IsAllDay: e.allDay,
          Description: e.description || '',
        }));

        console.log("Formatted Events:", formattedEvents);

        // Assign the formatted events to eventSettings.dataSource
        this.eventSettings = {
          dataSource: formattedEvents,
          fields: {
            id: 'Id',
            subject: { name: 'Subject' },
            location: { name: 'Location' },
            startTime: { name: 'StartTime' },
            endTime: { name: 'EndTime' },
            description: { name: 'Description' },
            isAllDay: { name: 'IsAllDay' }
          }
        };
      },
      (err) => {
        console.error('Error loading events:', err);
      }
    );
  }
}

