#include <stdio.h>
#include <stdlib.h>

typedef struct queue
{
    int front;
    int data;
    int rear;
    int *arr;
    int size;
} q;

q *create(q *qu)
{
    qu = (q *)malloc(sizeof(q));
    qu->size = 10;
    qu->front = qu->rear = -1;
    qu->arr = (int *)malloc(qu->size * sizeof(int));
    return qu;
}

int isEmpty(q *qu)
{
    return (qu->front == -1);
}

int isFull(q *qu)
{
    return (((qu->rear + 1) % qu->size) == qu->front);
}

void enQueue(q *qu, int data)
{
    if (isFull(qu))
    {
        printf("Overflow\n");
        return;
    }
    qu->rear = (qu->rear + 1) % qu->size;
    qu->arr[qu->rear] = data;

    if (qu->front == -1)
    {
        qu->front = qu->rear;
    }
    return;
}

int deQueue(q *qu)
{
    int data;
    if (isEmpty(qu))
    {
        printf("Underflow\n");
        return;
    }

    else
    {
        data = qu->arr[qu->front];
        if (qu->front == qu->rear)
            qu->front = qu->rear = -1;
        else
            qu->front = (qu->front + 1) % qu->size;
    }
    return data;
}

void display(q *qu)
{
    if (isEmpty(qu))
        printf("Empty Queue\n");

    else
    {
        for (int i = qu->front; i <= qu->rear; i++)
        {
            printf("%d\t", (qu->arr[i]));
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