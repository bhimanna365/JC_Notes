/* Simple Queue implementation using structure */

#include <stdio.h>
#include <stdlib.h>
#define max_size 5

struct Queue
{
  int q[max_size];
  int front, rear;
};
typedef struct Queue QUEUE;
void insert(QUEUE *qu, int item)
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
  }
}

void delete (QUEUE *qu)
{
  int item;
  if (qu->front > qu->rear)
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

void display(QUEUE *qu)
{
  int i;
  if (qu->front > qu->rear)
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
  Q.front = 0;
  Q.rear = -1;
  int ele, choice;
  for (;;)
  {
    printf("\n1: Insert\n");
    printf("\n2: Delete\n");
    printf("\n3: Display\n");
    printf("\n4: Exit\n");
    printf("Enter your choice\n");
    scanf("%d", &choice);
    switch (choice)
    {
    case 1:
      if (Q.rear == max_size - 1)
      {
        printf("\nQueue Overflow\n");
        return 0;
      }
      printf("\nEnter the element\n");
      scanf("%d", &ele);
      insert(&Q, ele);
      break;
    case 2:
      delete (&Q);
      break;
    case 3:
      display(&Q);
      break;
    default:
      exit(0);
    }
  }
}
