import { Component, ViewChild } from '@angular/core';
import { ActionEventArgs, DragAndDropService, EventSettingsModel, ExcelExportService, PopupOpenEventArgs, ResizeService, ScheduleComponent, ScheduleModule, View } from '@syncfusion/ej2-angular-schedule'
import { WeekService, MonthService, WorkWeekService, DayService, AgendaService } from '@syncfusion/ej2-angular-schedule';
import { CalendarService } from '../../../core/services/calendar/calendar.service';
import { parseISO } from 'date-fns';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [ScheduleModule],
    providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, DragAndDropService, ResizeService, ExcelExportService],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css'
})
export class CalendarComponent {
    @ViewChild('schedule') public schedule!: ScheduleComponent;
    public selectedDate: Date = new Date();
    public currentView: string = 'WorkWeek';
    public eventSettings: any = { dataSource: [] };
    

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
                    Category: e.category || 'Meetings' //ADD THIS!!!!
                }));

                console.log("Formatted Events:", formattedEvents);

                // Create a new object instead of modifying the existing one
                this.eventSettings = {
                    dataSource: formattedEvents,
                    fields: {
                        id: 'Id',
                        subject: { name: 'Subject' },
                        startTime: { name: 'StartTime' },
                        endTime: { name: 'EndTime' },
                        location: { name: 'Location' },
                        isAllDay: { name: 'IsAllDay' },
                        description: { name: 'Description' },
                        category: { name: 'Category' } //VERY IMPORTANT!!!
                    }
                };
            },
            (err) => {
                console.error('Error loading events:', err);
            }
        );
    }

    public onActionBegin(args: ActionEventArgs): void {
        // Creation
        if (args.requestType === 'eventCreate') {
            const ev = (args.data as any)[0];
            this.svc.createEvent({
                title: ev.Subject,
                start: ev.StartTime,
                end: ev.EndTime,
                location: ev.Location,
                allDay: ev.IsAllDay,
                description: ev.Description,
             
            }).subscribe(() => this.loadEvents());
        }
        // Update (drag/resize or edit)
        else if (args.requestType === 'eventChange') {
            const ev = args.data as any;
            this.svc.updateEvent({
                title: ev.Subject,
                start: ev.StartTime,
                end: ev.EndTime,
                location: ev.Location,
                allDay: ev.IsAllDay,
                description: ev.Description,
               
            }, ev.Id).subscribe(() => this.loadEvents());
        }
        // Deletion
        else if (args.requestType === 'eventRemove') {
            const events = args.data as any[]; // Cast args.data to an array

            if (Array.isArray(events)) {
                events.forEach(ev => {
                    this.svc.deleteEvent(ev.Id).subscribe(() => this.loadEvents());
                });
            } else {
                console.error("Unexpected data format for eventRemove:", args.data);
            }
        }
    }

   
}