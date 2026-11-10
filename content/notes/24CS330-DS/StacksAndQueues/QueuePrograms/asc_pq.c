// Without modifying insertion function
#include <stdio.h>
#include <stdlib.h>
#define q_size 5

int r = -1, f = 0;
int qu[5], small;

void insert()
{
       int ele;
       if (r == q_size - 1)
       {
              printf("\nQ Overflow\n");
              return;
       }
       else
       {
              printf("\nEnter the element to be inserted\n");
              scanf("%d", &ele);
              qu[++r] = ele;
       }
}

void del()
{
       int i, pos, j;
       if (f > r)
       {
              printf("\nQ empty\n");
              return;
       }
       else
       {
              small = qu[f];
              pos = f;
              for (i = f + 1; i <= r; i++)
              {
                     if (qu[i] < small)
                     {
                            small = qu[i];
                            pos = i;
                     }
                     for (j = pos; j <= r; j++)
                     {
                            qu[j] = qu[j + 1];
                     }
                     r = r - 1;
              }
              // qu[pos]=9999;

              printf("\nDeleted item is %d", small);
       }
}

void disp()
{
       int i;
       if (f > r)
       {
              printf("\nQueue empty\n");
              return;
       }
       for (i = f; i <= r; i++)
              printf("%d\t", qu[i]);
}

void main()
{
       int ele, ch;
       for (;;)
       {
              printf("\n1. Insert\n2. Delete\n3. Display\n4. Exit\n");
              printf("Enter your choice\n");
              scanf("%d", &ch);
              switch (ch)
              {
              case 1:
                     insert();
                     break;
              case 2:
                     del();
                     break;
              case 3:
                     disp();
                     break;
              case 4:
                     exit(0);
              }
       }
}
