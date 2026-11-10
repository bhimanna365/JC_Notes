#include <stdio.h>
#include <string.h>
#include <stdlib.h>
int *read(int arr[], int *n)
{
    printf("Enter size:");
    scanf("%d", n);
    arr = (int *)calloc(*n, sizeof(int));
    printf("Enter elements:\n");
    for (int i = 0; i < *n; i++)
    {
        scanf("%d", (arr + i));
    }
    return arr;
}
void display(int arr[], int n)
{
    for (int i = 0; i < n; i++)
    {
        printf("%d  ", *(arr + i));
    }
    printf("\n");
}
void insert(int arr[], int *n, int ele, int pos)
{
    if (pos >= 0 && pos <= *n - 1)
    {
        for (int i = *n - 1; i >= pos; i--)
        {
            arr[i + 1] = arr[i];
        }
        arr[pos] = ele;
        *n = *n + 1;
    }
    else
    {
        printf("Inavlid Position\n");
    }
}
void delete (int arr[], int *n, int pos)
{
    if (pos >= 0 && pos <= *n - 1)
    {
        for (int i = pos; i < *n - 1; i++)
        {
            arr[i] = arr[i + 1];
        }
        *n = *n - 1;
    }
    else
    {
        printf("Inavlid Position\n");
    }
}

int search(int *arr, int n, int key)
{
    int i, flag = 0, idx = -1;
    for (i = 0; i < n; i++)
    {
        if (key == arr[i])
        {
            printf(" %d found at idx %d ", key, i);
            flag = 1;
            idx = i;
            break;
        }
    }
    if (flag == 0)
    {
        printf(" element not found ");
    }
    return idx;
}

void delete_vl(int *arr, int *n, int value)
{
    int idx = search(arr, *n, value);
    if (idx != -1)
    {
        delete (arr, n, idx);
    }
}
void main()
{
    int *arr, n, ch, val, pos, key;
    while (1)
    {
        printf(" \n1.Read \n2.Display\n3.Insert\n4.Delete\n5.DeleteByVal\n6.Search\n7.Exit\n");
        printf("Enter your choice\n");
        scanf("%d", &ch);
        switch (ch)
        {
        case 1:
            arr = read(arr, &n);
            printf("After input\n");
            break;
        case 2:
            display(arr, n);
            break;
        case 3:
            printf("Enter position\n");
            scanf("%d", &pos);
            printf("Enter value\n");
            scanf("%d", &val);
            insert(arr, &n, val, pos);
            printf("After insert\n");
            display(arr, n);
            break;
        case 4:
            printf("Enter position\n");
            scanf("%d", &pos);
            delete (arr, &n, pos);
            printf("After delete\n");
            display(arr, n);
            break;

        case 5:
            printf("Enter value\n");
            scanf("%d", &val);
            delete_vl(arr, &n, val);
            printf("After delete\n");
            display(arr, n);
            break;

        case 6:
            printf("enter the key to searched\n ");
            scanf("%d", &key);
            search(arr, n, key);
            break;

        case 7:
            exit(0);
        }
    }
}