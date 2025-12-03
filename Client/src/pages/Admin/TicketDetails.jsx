import React, { useEffect, useState } from 'react';
import { fetchTicket } from '../../api/tickets';

export default function TicketDetails({ ticketId }) {
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchTicket(ticketId);
        setTicket(res);
      } catch { alert('Ticket not found'); }
    };
    load();
  }, [ticketId]);

  if(!ticket) return <p>Loading...</p>;

  return (
    <div>
      <h3>Ticket Details</h3>
      <p><b>TicketID:</b> {ticket.ticketId}</p>
      <p><b>User:</b> {ticket.user?.name} | {ticket.user?.email} | {ticket.user?.phone}</p>
      <p><b>Status:</b> {ticket.status}</p>
      <p><b>Assigned To:</b> {ticket.assignedTo?.name || 'Admin'}</p>
    </div>
  );
}
