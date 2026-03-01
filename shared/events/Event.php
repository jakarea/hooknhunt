<?php

namespace Shared\Events;

use Illuminate\Contracts\Queue\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;

abstract class Event implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Unique event ID
     */
    public string $eventId;

    /**
     * Event type name
     */
    public string $eventType;

    /**
     * Source service that dispatched this event
     */
    public string $sourceService;

    /**
     * Event timestamp
     */
    public string $timestamp;

    /**
     * Event payload
     */
    public array $data;

    /**
     * Create a new event instance.
     */
    public function __construct(array $data)
    {
        $this->eventId = (string) \Illuminate\Support\Str::uuid();
        $this->eventType = class_basename($this);
        $this->sourceService = config('service.name', 'unknown');
        $this->timestamp = now()->toIso8601String();
        $this->data = $data;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return $this->eventType;
    }

    /**
     * Get the broadcast channel.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('events'),
        ];
    }

    /**
     * Convert event to array for API/logging.
     */
    public function toArray(): array
    {
        return [
            'event_id' => $this->eventId,
            'event_type' => $this->eventType,
            'source_service' => $this->sourceService,
            'timestamp' => $this->timestamp,
            'data' => $this->data,
        ];
    }
}
