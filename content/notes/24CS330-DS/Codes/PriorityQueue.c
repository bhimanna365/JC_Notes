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

void enQueue(q *qu, int data)
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
        qu->front = qu->rear;
        return;
    }

    else
    {
        int j = qu->rear;
        while (j >= 0 && data < qu->arr[j])
        {
            qu->arr[j + 1] = qu->arr[j];
            j--;
        }
        qu->arr[j + 1] = data;
        qu->rear++;
    }
}

int deQueue(q *qu)
{
    if (isEmpty(qu))
    {
        printf("Queue Underflow\n");
        return;
    }

    if (qu->front == qu->rear)
    {
        int data = qu->arr[qu->front];
        qu->front = qu->rear = -1;
        return data;
    }

    else
    {
        int pos = 0;
        int small;
        small = qu->arr[qu->front];
        for (int i = qu->front + 1; i <= qu->rear; i++)
        {
            if (small > qu->arr[i])
            {
                small = qu->arr[i];
                pos = i;
            }
        }

        for (int i = pos; i <= qu->rear; i++)
        {
            qu->arr[i] = qu->arr[i + 1];
        }
        int data = small;
        qu->rear--;
        return data;
    }
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
        printf("\n1.Enqueue\n2.Dequeue\n3.Display\n4.Exit\n");
        scanf("%d", &ch);
        switch (ch)
        {
        case 1:
            printf("Enter data\n");
            scanf("%d", &data);
            enQueue(qu, data);
            break;

        case 2:
            printf("Deleted data is %d\n", deQueue(qu));
            break;

        case 3:
            display(qu);
            break;

        case 4:
            exit(0);
        }
    }
}