import dayjs from 'dayjs';

const startHour = 8;
const endHour = 20;

export default function WeeklyCalendar({ appointments, onCreate, onMove }) {
  const start = dayjs().startOf('week');
  const days = [...Array(7)].map((_, i) => start.add(i, 'day'));
  const hours = [...Array(endHour - startHour)].map((_, i) => startHour + i);

  const handleDrop = (e, day, hour) => {
    const id = e.dataTransfer.getData('appointmentId');
    const date = day.hour(hour).minute(0).second(0).toISOString();
    onMove(id, date);
  };

  return (
    <div className="card overflow-auto">
      <div className="grid grid-cols-8 min-w-[900px]">
        <div />
        {days.map((d) => <div className="text-center font-medium p-2 border-b" key={d.toString()}>{d.format('ddd DD/MM')}</div>)}
        {hours.map((hour) => (
          <div key={`row-${hour}`} className="contents">
            <div key={`h${hour}`} className="text-xs p-2 border-r border-slate-200 dark:border-slate-800">{`${hour}:00`}</div>
            {days.map((day) => {
              const slot = day.hour(hour);
              const slotAppointments = appointments.filter((a) => dayjs(a.start_at).isSame(slot, 'hour') && dayjs(a.start_at).isSame(day, 'day'));
              return (
                <div
                  key={`${day}-${hour}`}
                  onDoubleClick={() => onCreate(slot.toISOString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, day, hour)}
                  className="h-20 p-1 border border-slate-200 dark:border-slate-800"
                >
                  {slotAppointments.map((a) => (
                    <div key={a.id} draggable onDragStart={(e) => e.dataTransfer.setData('appointmentId', a.id)} className="bg-indigo-500 text-white rounded p-1 text-xs mb-1">
                      {a.client_name} · {a.service_name}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
