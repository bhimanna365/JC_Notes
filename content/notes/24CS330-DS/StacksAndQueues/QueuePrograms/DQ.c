/* Dequeue implementation using structure */

#include <stdio.h>
#include <stdlib.h>
#define max_size 5

struct Queue
{
  int q[max_size];
  int front, rear;
};
typedef struct Queue QUEUE;

void insert_rear(QUEUE *qu, int item)
{
  if (qu->rear == max_size - 1)
  {
    printf("\nQueue overflow");
    return;
  }
  else
  {
    qu->rear = qu->rear + 1;
    qu->q[qu->rear] = item;
    if (qu->front == -1)
      qu->front = 0;
  }
}

void insert_front(QUEUE *qu, int item)
{
  if (qu->front == 0)
  {
    printf("\nCannot insert from front end\n");
    return;
  }
  if (qu->front == -1)
  {
    qu->front++;
    qu->q[qu->front] = item;
    qu->rear = 0;
  }
  else
  {
    qu->front--;
    qu->q[qu->front] = item;
  }
}

void delete_front(QUEUE *qu)
{
  int item;
  if (qu->front == -1 || qu->front > qu->rear)
  {
    printf("\nQueue is empty\n");
    return;
  }
  else
  {
    item = qu->q[qu->front];
    qu->front = qu->front + 1;
    printf("Deleted item is %d", item);
  }
}

void delete_rear(QUEUE *qu)
{
  int item;
  if (qu->rear == -1 || qu->front > qu->rear)
  {
    printf("\nQueue is empty\n");
    return;
  }
  else
  {
    item = qu->q[qu->rear];
    qu->rear = qu->rear - 1;
    printf("Deleted item is %d", item);
  }
}
void display(QUEUE *qu)
{
  int i;
  if (qu->rear != -1 && (qu->front > qu->rear))
  {
    printf("\nQueue empty\n");
    return;
  }
  printf("\nContents are :\n");
  for (i = qu->front; i <= qu->rear; i++)
    printf("%d\t", qu->q[i]);
}

int main()
{

  QUEUE Q;
  Q.front = -1;
  Q.rear = -1;
  int ele, choice;
  for (;;)
  {
    printf("\n1: Insert Front\n");
    printf("\n2: Insert Rear\n");
    printf("\n3: Delete Front\n");
    printf("\n4: Delete Rear\n");
    printf("\n5: Display\n");
    printf("\n6: Exit\n");
    printf("Enter your choice\n");
    scanf("%d", &choice);
    switch (choice)
    {
    case 1:
      printf("\nEnter the element\n");
      scanf("%d", &ele);
      insert_front(&Q, ele);
      break;
    case 2:
      printf("\nEnter the element\n");
      scanf("%d", &ele);
      insert_rear(&Q, ele);
      break;
    case 3:
      delete_front(&Q);
      break;
    case 4:
      delete_rear(&Q);
      break;
    case 5:
      display(&Q);
      break;
    default:
      exit(0);
    }
  }
}
