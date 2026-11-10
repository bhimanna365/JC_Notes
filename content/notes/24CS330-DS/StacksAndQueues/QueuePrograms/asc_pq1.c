// Without modifying delete function
#include <stdio.h>
#include <stdlib.h>
int q_size = 5, f = 0, r = -1;
int qu[5], small;

void insert(int ele)
{
       int j;
       if (r == q_size - 1)
       {
              printf("\nQ Overflow\n");
              return;
       }
       else
       {
              printf("\nEnter the element to be inserted\n");
              scanf("%d", &ele);
              j = r;
              while (j >= 0 && ele < qu[j])
              {
                     qu[j + 1] = qu[j];
                     j--;
              }
              qu[j + 1] = ele;
              r++;
       }
}

void del()
{
       if (f > r)
       {
              printf("\nQueue empty\n");
              return;
       }
       printf("\nThe element deleted is %d\n", qu[f++]);
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
                     insert(ele);
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
