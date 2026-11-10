#include <stdio.h>
#include <stdlib.h>

typedef struct queue
{
    int data;
    int front, rear;
    int capacity;
    int *arr;
} q;

q *create(q *qu)
{
    qu = (q *)malloc(sizeof(q));
    qu->capacity = 40;
    qu->arr = (int *)malloc(qu->capacity * sizeof(int));
    qu->front = qu->rear = -1;
    return qu;
}

int isEmpty(q *qu)
{
    return (qu->front == -1);
}

int isFull(q *qu)
{
    return (qu->rear == qu->capacity - 1);
}

void enQueueRear(q *qu, int data)
{
    if (isFull(qu))
    {
        printf("Queue Overflow\n");
        return;
    }
    qu->rear++;
    qu->arr[qu->rear] = data;

    if (qu->front == -1)
        qu->front = qu->rear;

    return;
}

void enQueueFront(q *qu, int data)
{
    if (isFull(qu))
    {
        printf("Queue Overflow\n");
        return;
    }
    if (qu->front == -1)
    {
        qu->rear++;
        qu->arr[qu->rear] = data;
        qu->front == qu->rear;
        return;
    }
    else
    {
        qu->front--;
        if (qu->front == -1)
        {
            printf("Queue OverFlow\n");
            qu->front++;
        }
        qu->arr[qu->front] = data;
        return;
    }
}

int deQueueFront(q *qu)
{
    if (isEmpty(qu))
    {
        printf("Queue Underflow\n");
        return;
    }

    int data = (qu->arr[qu->front]);
    if (qu->front == qu->rear)
        qu->rear = qu->front = -1;
    else
    {
        qu->front++;
    }
    return data;
}

int deQueueRear(q *qu)
{
    if (isEmpty(qu))
    {
        printf("Queue Underflow\n");
        return;
    }

    int data = qu->arr[qu->rear];

    if (qu->front == qu->rear)
        qu->rear = qu->front = -1;
    else
        qu->rear--;

    return data;
}

void display(q *qu)
{
    if (isEmpty(qu))
    {
        printf("Empty Queue\n");
        return;
    }
    else
    {
        for (int i = qu->front; i <= qu->rear; i++)
        {
            printf("%d\t", qu->arr[i]);
        }
    }
}

int main()
{
    q *qu = create(qu);
    int ch, data;

    while (1)
    {
        printf("\n1.EnqueueRear\n2.DequeueFront\n3.EnqueueFront\n4.DequeueRear\n5.Display\n6.Exit\n");
        scanf("%d", &ch);
        switch (ch)
        {
        case 1:
            printf("Enter data\n");
            scanf("%d", &data);
            enQueueRear(qu, data);
            break;

        case 2:
            printf("Deleted data is %d\n", deQueueFront(qu));
            break;

        case 3:
            printf("Enter data\n");
            scanf("%d", &data);
            enQueueFront(qu, data);
            break;

        case 4:
            printf("Deleted data is %d\n", deQueueRear(qu));
            break;

        case 5:
            display(qu);
            break;

        case 6:
            exit(0);
        }
    }
}